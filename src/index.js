#!/usr/bin/env node
// Path B refactor: switch to McpServer with first-class resources, prompts, and tools
// - Keeps your API client + handlers
// - Returns structured JSON (not stringified text)
// - Adds domain resources and parameterized project summary
// - Adds prompts for domain primer and incident triage

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { HammerTechApiClient } from "../dist/api-client.js";
import { ConfigSchema } from "../dist/types.js";

export class HammerTechMCPServer {
  server;
  apiClient = null;

  constructor() {
    this.server = new McpServer({ name: "hammertech-api-server", version: "1.0.0" });
    this.registerResources();
    this.registerPrompts();
    this.registerTools();
  }

  /** --------------------- RESOURCES --------------------- **/
  registerResources() {
    // Help Center: article as resource (by id or slug)
    this.server.registerResource(
      "ht-help-article",
      new ResourceTemplate("hammertech://help/article/{idOrSlug}"),
      {
        title: "Help Center Article",
        description: "Expose a HammerTech Help Center article as a markdown resource.",
        mimeType: "text/markdown",
      },
      async (uri, { idOrSlug, locale = "en-us" }) => {
        const art = await this.fetchHelpArticle(idOrSlug, locale);
        if (!art || (!art.markdown && !art.html)) {
          return {
            contents: [
              { uri: uri.href, text: `# Help article not available\nSource: ${art?.url ?? idOrSlug}` },
            ],
          };
        }
        return { contents: [{ uri: art.url, text: art.markdown ?? art.html }] };
      }
    );

    // Help Center: search as resource (returns a markdown list)
    this.server.registerResource(
      "ht-help-search",
      new ResourceTemplate("hammertech://help/search/{q}"),
      {
        title: "Help Center Search",
        description: "Search help.hammertech.com and return top matches as links.",
        mimeType: "text/markdown",
      },
      async (uri, { q, locale = "en-us", limit = 5 }) => {
        const res = await this.searchHelp(q, locale, limit);
        const lines = [
          `# Help search: \"${q}\"`,
          `Source: ${res.url}`,
          "",
          ...(res.items.length
            ? res.items.map((i, idx) => `${idx + 1}. [${i.title}](${i.url}) — ${i.idOrSlug}`)
            : ["_No results_"]),
        ];
        return { contents: [{ uri: uri.href, text: lines.join("\n") }] };
      }
    );
  }

  /** --------------------- PROMPTS --------------------- **/
  registerPrompts() {
    // Extra prompts for guided flows
    this.server.registerPrompt(
      "create_worker_profile_flow",
      {
        title: "Create Worker Profile (guided)",
        description: "Collect required fields, confirm, then create.",
        argsSchema: {},
      },
      () => ({
        messages: [
          {
            role: "system",
            content: {
              type: "text",
              text: `When asked to create a worker profile:
1) Verify required fields: firstName, lastName, dateOfBirth (ISO), preferredCommunicationLanguage; email optional.
2) Repeat back the values and ask for confirmation.
3) On explicit confirm, call create_worker_profile with those fields.
4) Do not include confidential extras unless requested.`,
            },
          },
        ],
      })
    );

    this.server.registerPrompt(
      "iot_event_from_image",
      {
        title: "Log IoT Event from an image",
        description: "Turn an uploaded image into an IoT event with metadata.",
        argsSchema: {},
      },
      () => ({
        messages: [
          {
            role: "system",
            content: {
              type: "text",
              text: `If the user uploaded an image and wants to log an IoT event:
- Ask for: projectId, iotVendorId, iotEventTypeId, optional description/locationId.
- Use create_iot_event_with_image with image base64 and filename.
- Validate extension is PNG or JPEG.
- Summarize what was logged.`,
            },
          },
        ],
      })
    );
  }

  /** --------------------- TOOLS --------------------- **/
  registerTools() {
    // Helper to keep handlers concise
    const json = (obj) => ({ content: [{ type: "json", json: obj }] });
    const textError = (msg) => ({ content: [{ type: "text", text: msg }], isError: true });

    // Ensure API client is initialized before any call
    const withApi = (fn) => async (args) => {
      if (!this.apiClient) {
        throw new Error(
          "HammerTech API client not configured. Set HAMMERTECH_JWT_TOKEN and HAMMERTECH_REGION."
        );
      }
      return fn(args);
    };

    // Connectivity / sanity check tool
    this.server.registerTool(
      "status.ping",
      {
        title: "Ping",
        description: "Check server/version and token/region presence.",
        inputSchema: z.object({}).strict(),
      },
      async () => ({
        content: [
          {
            type: "json",
            json: {
              ok: true,
              server: "hammertech-api-server",
              version: "1.0.0",
              region: process.env.HAMMERTECH_REGION || "us",
              authConfigured: !!process.env.HAMMERTECH_JWT_TOKEN,
            },
          },
        ],
      })
    );

    /* ---------------- Help Center tools ---------------- */
    this.server.registerTool(
      "help.search",
      {
        title: "Search Help Center",
        description: "Search https://help.hammertech.com for articles.",
        inputSchema: z
          .object({
            q: z.string(),
            locale: z.string().optional(),
            limit: z.number().int().min(1).max(10).optional(),
          })
          .strict(),
      },
      async ({ q, locale = "en-us", limit = 5 }) => {
        const result = await this.searchHelp(q, locale, limit);
        return { content: [{ type: "json", json: result }] };
      }
    );

    this.server.registerTool(
      "help.get",
      {
        title: "Get Help Center article",
        description: "Fetch a specific Help Center article by id or slug.",
        inputSchema: z
          .object({
            idOrSlug: z.string(),
            locale: z.string().optional(),
            format: z.enum(["markdown", "html"]).optional(),
          })
          .strict(),
      },
      async ({ idOrSlug, locale = "en-us", format = "markdown" }) => {
        const art = await this.fetchHelpArticle(idOrSlug, locale);
        if (!art || (!art.markdown && !art.html)) {
          return {
            content: [
              { type: "text", text: `Article not available. Tried: ${idOrSlug}` },
            ],
            isError: true,
          };
        }
        const body = format === "html" ? art.html || art.markdown : art.markdown || art.html;
        const out = {
          title: art.title || String(idOrSlug),
          url: art.url,
          format,
          body,
        };
        return { content: [{ type: "json", json: out }] };
      }
    );

    this.server.registerTool(
      "help.summarize",
      {
        title: "Summarize Help Center article",
        description: "Fetch an article and return a concise summary plus key steps.",
        inputSchema: z
          .object({
            idOrSlug: z.string(),
            locale: z.string().optional(),
            maxBullets: z.number().int().min(1).max(8).optional(),
          })
          .strict(),
      },
      async ({ idOrSlug, locale = "en-us", maxBullets = 5 }) => {
        const art = await this.fetchHelpArticle(idOrSlug, locale);
        if (!art || (!art.markdown && !art.html)) {
          return {
            content: [
              { type: "text", text: `Article not available. Tried: ${idOrSlug}` },
            ],
            isError: true,
          };
        }

        const md = art.markdown || `# ${art.title}\n\n`;
        const lines = md.split(/\r?\n/);
        const title = (art.title || (lines[0] || "").replace(/^#\s*/, "")).trim();

        // Collect candidate bullet/step lines
        const bullets = [];
        for (const ln of lines) {
          const t = ln.trim();
          if (/^[-*•]\s+/.test(t)) bullets.push(t.replace(/^[-*•]\s+/, ""));
          else if (/^\d+[\.)]\s+/.test(t)) bullets.push(t.replace(/^\d+[\.)]\s+/, ""));
          if (bullets.length >= maxBullets) break;
        }

        // Fallback summary from first sentences
        let summary = "";
        if (bullets.length === 0) {
          const paragraph = lines.join(" ").replace(/\s+/g, " ").trim();
          const sentences = paragraph.split(/(?<=[.!?])\s+/).slice(0, 3);
          summary = sentences.join(" ");
        } else {
          summary = bullets
            .slice(0, Math.min(maxBullets, bullets.length))
            .join(" • ");
        }

        const out = {
          title,
          url: art.url,
          summary,
          steps: bullets.slice(0, Math.min(maxBullets, bullets.length)),
        };
        return { content: [{ type: "json", json: out }] };
      }
    );

    /* ---------------- Projects ---------------- */
    this.server.registerTool(
      "list_projects",
      {
        title: "List projects",
        description: "List construction projects with optional filtering and pagination",
        inputSchema: z
          .object({
            skip: z.number().optional(),
            take: z.number().max(100).optional(),
            sortBy: z.string().optional(),
            modifiedSince: z.string().optional(),
            projectId: z.string().optional(),
          })
          .strict(),
      },
      withApi(async (args) => json(await this.apiClient.listProjects(args)))
    );

    this.server.registerTool(
      "get_project",
      {
        title: "Get project",
        description: "Retrieve a specific construction project by ID",
        inputSchema: z.object({ id: z.string() }).strict(),
      },
      withApi(async ({ id }) => json(await this.apiClient.getProject(id)))
    );

    /* ---------------- Workers ---------------- */
    const listFilter = z
      .object({
        skip: z.number().optional(),
        take: z.number().optional(),
        sortBy: z.string().optional(),
        modifiedSince: z.string().optional(),
        projectId: z.string().optional(),
      })
      .strict();

    this.server.registerTool(
      "list_workers",
      {
        title: "List workers",
        description: "List workers with optional filters",
        inputSchema: listFilter,
      },
      withApi(async (args) => json(await this.apiClient.listWorkers(args)))
    );

    this.server.registerTool(
      "get_worker",
      {
        title: "Get worker",
        description: "Retrieve a specific worker by ID",
        inputSchema: z.object({ id: z.string() }).strict(),
      },
      withApi(async ({ id }) => json(await this.apiClient.getWorker(id)))
    );

    /* ---------------- Worker Profiles ---------------- */
    this.server.registerTool(
      "list_worker_profiles",
      {
        title: "List worker profiles",
        description: "List worker profiles with optional filters",
        inputSchema: listFilter,
      },
      withApi(async (args) => json(await this.apiClient.listWorkerProfiles(args)))
    );

    this.server.registerTool(
      "get_worker_profile",
      {
        title: "Get worker profile",
        description: "Retrieve a specific worker profile by ID",
        inputSchema: z
          .object({ id: z.string(), includeConfidentialData: z.boolean().optional() })
          .strict(),
      },
      withApi(async ({ id, includeConfidentialData }) =>
        json(await this.apiClient.getWorkerProfile(id, includeConfidentialData))
      )
    );

    this.server.registerTool(
      "create_worker_profile",
      {
        title: "Create worker profile",
        description: "Create a new worker profile",
        inputSchema: z
          .object({
            firstName: z.string(),
            lastName: z.string(),
            dateOfBirth: z.string(),
            preferredCommunicationLanguage: z.string(),
            email: z.string().email().optional(),
          })
          .strict(),
      },
      withApi(async (args) => json(await this.apiClient.createWorkerProfile(args)))
    );

    this.server.registerTool(
      "update_worker_profile",
      {
        title: "Update worker profile",
        description: "Update an existing worker profile",
        inputSchema: z
          .object({
            id: z.string(),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            dateOfBirth: z.string().optional(),
            preferredCommunicationLanguage: z.string().optional(),
            email: z.string().optional(),
          })
          .strict(),
      },
      withApi(async ({ id, ...updateData }) =>
        json(await this.apiClient.updateWorkerProfile(id, updateData))
      )
    );

    /* ---------------- Employers ---------------- */
    this.server.registerTool(
      "list_employers",
      {
        title: "List employers",
        description: "List employers with optional filters",
        inputSchema: listFilter,
      },
      withApi(async (args) => json(await this.apiClient.listEmployers(args)))
    );

    this.server.registerTool(
      "get_employer",
      {
        title: "Get employer",
        description: "Retrieve a specific employer by ID",
        inputSchema: z.object({ id: z.string() }).strict(),
      },
      withApi(async ({ id }) => json(await this.apiClient.getEmployer(id)))
    );

    this.server.registerTool(
      "create_employer",
      {
        title: "Create employer",
        description: "Create a new employer",
        inputSchema: z.object({ name: z.string(), description: z.string().optional() }).strict(),
      },
      withApi(async (args) => json(await this.apiClient.createEmployer(args)))
    );

    /* ---------------- Employer Profiles ---------------- */
    this.server.registerTool(
      "list_employer_profiles",
      {
        title: "List employer profiles",
        description: "List employer profiles with optional filters",
        inputSchema: listFilter,
      },
      withApi(async (args) => json(await this.apiClient.listEmployerProfiles(args)))
    );

    this.server.registerTool(
      "get_employer_profile",
      {
        title: "Get employer profile",
        description: "Retrieve a specific employer profile by ID",
        inputSchema: z.object({ id: z.string() }).strict(),
      },
      withApi(async ({ id }) => json(await this.apiClient.getEmployerProfile(id)))
    );

    this.server.registerTool(
      "create_employer_profile",
      {
        title: "Create employer profile",
        description: "Create a new employer profile",
        inputSchema: z
          .object({ name: z.string(), description: z.string().optional(), employerId: z.string().optional() })
          .strict(),
      },
      withApi(async (args) => json(await this.apiClient.createEmployerProfile(args)))
    );

    this.server.registerTool(
      "update_employer_profile",
      {
        title: "Update employer profile",
        description: "Update an existing employer profile",
        inputSchema: z
          .object({ id: z.string(), name: z.string().optional(), description: z.string().optional(), employerId: z.string().optional() })
          .strict(),
      },
      withApi(async ({ id, ...updateData }) =>
        json(await this.apiClient.updateEmployerProfile(id, updateData))
      )
    );

    /* ---------------- IoT Vendors ---------------- */
    this.server.registerTool(
      "list_iot_vendors",
      {
        title: "List IoT vendors",
        description: "List IoT vendors with optional filters",
        inputSchema: listFilter,
      },
      withApi(async (args) => json(await this.apiClient.listIoTVendors(args)))
    );

    this.server.registerTool(
      "get_iot_vendor",
      {
        title: "Get IoT vendor",
        description: "Retrieve a specific IoT vendor by ID",
        inputSchema: z.object({ id: z.string() }).strict(),
      },
      withApi(async ({ id }) => json(await this.apiClient.getIoTVendor(id)))
    );

    this.server.registerTool(
      "create_iot_vendor",
      {
        title: "Create IoT vendor",
        description: "Create a new IoT vendor",
        inputSchema: z.object({ name: z.string(), description: z.string().optional() }).strict(),
      },
      withApi(async (args) => json(await this.apiClient.createIoTVendor(args)))
    );

    /* ---------------- IoT Events ---------------- */
    this.server.registerTool(
      "list_iot_events",
      {
        title: "List IoT events",
        description: "List IoT events with optional filters",
        inputSchema: listFilter,
      },
      withApi(async (args) => json(await this.apiClient.listIoTEvents(args)))
    );

    this.server.registerTool(
      "get_iot_event",
      {
        title: "Get IoT event",
        description: "Retrieve a specific IoT event by ID",
        inputSchema: z.object({ id: z.string() }).strict(),
      },
      withApi(async ({ id }) => json(await this.apiClient.getIoTEvent(id)))
    );

    this.server.registerTool(
      "create_iot_event",
      {
        title: "Create IoT event",
        description:
          "Create a new IoT event record capturing data points from connected IoT devices with optional metadata and attachments",
        inputSchema: z
          .object({
            projectId: z.string(),
            eventDate: z.string().optional(),
            iotVendorId: z.string(),
            iotEventTypeId: z.string(),
            locationId: z.string().optional(),
            description: z.string().optional(),
            contentType: z.string().optional(),
            content: z.string().optional(),
            attachments: z
              .array(
                z.object({
                  fileName: z.string(),
                  base64FileContent: z.string(),
                  annotation: z.string().optional(),
                })
              )
              .optional(),
          })
          .strict(),
      },
      withApi(async (args) => {
        // default eventDate
        if (!args.eventDate) args.eventDate = new Date().toISOString();
        // validate attachments
        const allowed = [".png", ".jpg", ".jpeg", ".pdf", ".doc", ".docx", ".xls", ".xlsx"];
        if (args.attachments) {
          for (const a of args.attachments) {
            const ext = a.fileName.toLowerCase().slice(a.fileName.lastIndexOf("."));
            if (!allowed.includes(ext)) {
              return textError(
                `Error: File type not supported for \"${a.fileName}\". Allowed types: PNG, JPEG, PDF, DOC, DOCX, XLS, XLSX`
              );
            }
          }
        }
        return json(await this.apiClient.createIoTEvent(args));
      })
    );

    this.server.registerTool(
      "create_iot_event_with_image",
      {
        title: "Create IoT event (with image)",
        description: "Create a new IoT event and attach an uploaded image from the conversation.",
        inputSchema: z
          .object({
            projectId: z.string(),
            eventDate: z.string().optional(),
            iotVendorId: z.string(),
            iotEventTypeId: z.string(),
            locationId: z.string().optional(),
            description: z.string().optional(),
            contentType: z.string().optional(),
            content: z.string().optional(),
            imageBase64: z.string(),
            imageFileName: z.string(),
            imageAnnotation: z.string().optional(),
          })
          .strict(),
      },
      withApi(async (args) => {
        if (!args.eventDate) args.eventDate = new Date().toISOString();
        const allowedImg = [".png", ".jpg", ".jpeg"];
        const ext = args.imageFileName
          .toLowerCase()
          .slice(args.imageFileName.lastIndexOf("."));
        if (!allowedImg.includes(ext)) {
          return textError(
            `Error: Image file type not supported for \"${args.imageFileName}\". Allowed: PNG, JPEG`
          );
        }
        const attachment = {
          fileName: args.imageFileName,
          base64FileContent: args.imageBase64,
          annotation: args.imageAnnotation ?? undefined,
        };
        const iotEventData = {
          projectId: args.projectId,
          eventDate: args.eventDate,
          iotVendorId: args.iotVendorId,
          iotEventTypeId: args.iotEventTypeId,
          locationId: args.locationId,
          description: args.description,
          contentType: args.contentType,
          content: args.content,
          attachments: [attachment],
        };
        return json(await this.apiClient.createIoTEvent(iotEventData));
      })
    );
  }

  /** --------------------- HELP SITE HELPERS --------------------- **/
  async fetchHelpArticle(idOrSlug, locale = "en-us") {
    try {
      const slug = String(idOrSlug).replace(/^\/+|\/+$/g, "");
      const url = `https://help.hammertech.com/hc/${locale}/articles/${slug}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "HammerTech-MCP/1.0 (+mcp)" },
      });
      if (!res.ok) return { url, status: res.status, markdown: null, html: null };
      const html = await res.text();
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const bodyMatch = html.match(
        /<div[^>]+class=["'][^"']*(article-body|article__body|zd-article|article-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
      );
      const rawBody = bodyMatch ? bodyMatch[2] : html;
      const text = rawBody
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : slug;
      return { url, title, html: rawBody, markdown: `# ${title}\n\n${text}` };
    } catch (e) {
      return { url: String(idOrSlug), error: String(e), markdown: null, html: null };
    }
  }

  async searchHelp(q, locale = "en-us", limit = 5) {
    try {
      const url = `https://help.hammertech.com/hc/${locale}/search?query=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { "User-Agent": "HammerTech-MCP/1.0 (+mcp)" } });
      if (!res.ok) return { url, items: [], status: res.status };
      const html = await res.text();
      const re = /href=\"\/hc\/[^\"]*\/articles\/([0-9]+-[^\"]+)\"[^>]*>(.*?)<\/a>/gi;
      const items = [];
      const seen = new Set();
      let m;
      while ((m = re.exec(html)) && items.length < limit) {
        const slug = m[1];
        const title = m[2].replace(/<[^>]+>/g, "").trim();
        if (seen.has(slug)) continue;
        seen.add(slug);
        items.push({
          idOrSlug: slug,
          title,
          url: `https://help.hammertech.com/hc/${locale}/articles/${slug}`,
        });
      }
      return { url, items };
    } catch (e) {
      return { url: null, items: [], error: String(e) };
    }
  }

  /** --------------------- API CLIENT --------------------- **/
  initializeApiClient() {
    const jwtToken = process.env.HAMMERTECH_JWT_TOKEN;
    const region = process.env.HAMMERTECH_REGION || "us";
    if (!jwtToken) {
      throw new Error("HAMMERTECH_JWT_TOKEN environment variable is required");
    }
    const config = ConfigSchema.parse({ jwtToken, region });
    this.apiClient = new HammerTechApiClient(config);
  }

  async run() {
    try {
      this.initializeApiClient();
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error("HammerTech MCP server (McpServer) running on stdio");
    } catch (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
  }
}

const server = new HammerTechMCPServer();
server.run().catch(console.error);
