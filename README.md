# PCN Document Retriever MCP Server

An MCP (Model Context Protocol) server that provides document retrieval functionality for PCN (Project Concept Note) documents by project ID.

## Features

- Exposes a `DocumentRetrieverByProjectID` tool
- Returns comprehensive project information including strategic alignment, target groups, and budget details
- Supports detailed project documentation with formatted output
- Built using the modern MCP SDK with Zod schema validation

## Available Projects

The server currently provides access to the following projects:

### 2000004677 - Rural Youth Agribusiness Development Programme (RYADP)
- **Country:** Kenya
- **Region:** East and Southern Africa
- **Total Cost:** $45.0M (IFAD: $20.0M)
- **Focus:** Youth-led agribusiness development and climate resilience

### 2000004678 - Smallholder Agriculture Productivity Enhancement Project (SAPEP)
- **Country:** Uganda
- **Region:** East and Southern Africa
- **Total Cost:** $60.0M (IFAD: $25.0M)
- **Focus:** Smallholder farmer productivity and market access

## Installation & Configuration

This server is designed to be run directly via npx from the private GitHub repository.

**Note:** For the npx approach to work, these MCP server files should be moved to the root of the `ifad/agents_demo` repository.

### 1. Create a Fine-Grained GitHub PAT

Create a [fine-grained Personal Access Token](https://github.com/settings/tokens?type=beta) with the following permissions:
- **Repository access**: Only select this repository (`ifad/agents_demo`)
- **Permissions**:
  - `Contents`: **Read-only**

### 2. Configure Claude for Desktop

Add the following to your `claude_desktop_config.json`. Replace `ghp_YOUR_FINE_GRAINED_TOKEN` with the token you just created.

```json
{
  "mcpServers": {
    "document-retriever": {
      "command": "npx",
      "args": [
        "-y",
        "https://ghp_YOUR_FINE_GRAINED_TOKEN@github.com/ifad/agents_demo.git"
      ]
    }
  }
}
```

**⚠️ Security Warning:** This method exposes your token in a local config file. Only use a token that is strictly limited to this single repository with read-only access.

### 3. Config File Locations

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

## Usage

Once configured, restart Claude Desktop completely. You can then ask Claude to use the tool:

**Examples:**
- "Retrieve the document for project 2000004677 and tell me about its strategic alignment."
- "Show me the project components and budget breakdown for SAPEP (project 2000004678)."
- "What are the target groups for the Rural Youth Agribusiness Development Programme?"

## Development

### Local Testing

For development and testing, you can clone the repository locally:

1. Clone and install:
   ```bash
   git clone https://github.com/ifad/agents_demo.git
   cd agents_demo
   # If files are in pdr_mcp subdirectory, move them to root:
   mv pdr_mcp/* .
   npm install
   chmod +x index.js
   ```

2. Run the server:
   ```bash
   npm start
   ```

### Production Use

For production use with Claude Desktop, use the npx approach described above for secure access to the private repository. The MCP server files should be at the repository root for npx to work properly.

### Adding New Projects

To add new project documents, update the `MOCK_DOCUMENTS` object in `index.js` with the following structure:

```javascript
"PROJECT_ID": {
  projectId: "PROJECT_ID",
  projectName: "Full Project Name",
  acronym: "ACRONYM",
  country: "Country",
  region: "Region",
  approvalDate: "YYYY-MM-DD",
  projectCost: 0, // in USD
  ifadFinancing: 0, // in USD
  status: "Status",
  sections: {
    strategicAlignment: "...",
    targetGroup: "...",
    developmentObjective: "...",
    components: [
      {
        name: "Component Name",
        budget: 0, // in USD
        description: "Description"
      }
    ]
  }
}
```

## Architecture

This MCP server uses:
- **@modelcontextprotocol/sdk**: Modern MCP SDK for server implementation
- **Zod**: Schema validation for tool inputs
- **Node.js**: Runtime environment (requires Node.js 16+)

The server implements a single tool that:
1. Validates the input project ID using Zod schema
2. Retrieves project data from the in-memory mock database
3. Formats the response with comprehensive project information
4. Returns structured text content for LLM consumption

## License

MIT 