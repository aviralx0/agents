#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Mock document database
const MOCK_DOCUMENTS = {
  "2000004677": {
    projectId: "2000004677",
    projectName: "Rural Youth Agribusiness Development Programme",
    acronym: "RYADP",
    country: "Kenya",
    region: "East and Southern Africa",
    approvalDate: "2024-03-15",
    projectCost: 45000000,
    ifadFinancing: 20000000,
    status: "Approved",
    sections: {
      strategicAlignment: `
        The Rural Youth Agribusiness Development Programme (RYADP) is strategically aligned with Kenya's Vision 2030 
        and the Big Four Agenda, specifically targeting food security and manufacturing. The programme directly 
        contributes to SDG 1 (No Poverty), SDG 2 (Zero Hunger), and SDG 8 (Decent Work and Economic Growth).
        
        Key alignment areas:
        - National Youth Employment Strategy 2021-2025
        - Agricultural Sector Transformation and Growth Strategy
        - Kenya Climate Smart Agriculture Implementation Framework
      `,
      targetGroup: `
        Primary beneficiaries: 50,000 rural youth (aged 18-35)
        - 60% women
        - 30% persons with disabilities
        - Focus on unemployed and underemployed youth in rural areas
      `,
      developmentObjective: `
        To enhance sustainable livelihoods and food security for rural youth through 
        climate-resilient agribusiness development and improved access to productive resources.
      `,
      components: [
        {
          name: "Youth Agribusiness Development",
          budget: 15000000,
          description: "Support for youth-led enterprises in agriculture value chains"
        },
        {
          name: "Access to Finance and Markets",
          budget: 12000000,
          description: "Facilitating access to credit and market linkages"
        },
        {
          name: "Capacity Building and Skills Development",
          budget: 10000000,
          description: "Technical and business skills training for youth"
        }
      ]
    }
  },
  "2000004678": {
    projectId: "2000004678",
    projectName: "Smallholder Agriculture Productivity Enhancement Project",
    acronym: "SAPEP",
    country: "Uganda",
    region: "East and Southern Africa",
    approvalDate: "2024-02-20",
    projectCost: 60000000,
    ifadFinancing: 25000000,
    status: "Approved",
    sections: {
      strategicAlignment: `
        SAPEP is fully aligned with Uganda's National Development Plan III (NDPIII) and the 
        Agriculture Sector Strategic Plan. The project supports the government's efforts to 
        transform subsistence agriculture into commercial agriculture while ensuring environmental 
        sustainability.
        
        Strategic priorities addressed:
        - Increasing agricultural productivity and value addition
        - Strengthening farmer organizations and cooperatives
        - Climate change adaptation and mitigation
        - Gender equality and women's empowerment in agriculture
      `,
      targetGroup: `
        Direct beneficiaries: 75,000 smallholder farming households
        - 50% women-headed households
        - 20% youth (under 30 years)
        - Focus on farmers with less than 2 hectares of land
      `,
      developmentObjective: `
        To sustainably increase agricultural productivity, income, and food security of 
        smallholder farmers through improved technologies, market access, and climate resilience.
      `,
      components: [
        {
          name: "Productivity Enhancement",
          budget: 20000000,
          description: "Improved seeds, farming techniques, and irrigation"
        },
        {
          name: "Market Infrastructure Development",
          budget: 18000000,
          description: "Storage facilities, rural roads, and market information systems"
        },
        {
          name: "Institutional Strengthening",
          budget: 12000000,
          description: "Farmer organizations and extension services"
        }
      ]
    }
  }
};

// Create MCP server
const server = new Server(
  {
    name: 'document-retriever-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'DocumentRetrieverByProjectID',
        description: 'Retrieves project document content by project ID',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'The project ID (e.g., 2000004677)',
            },
          },
          required: ['projectId'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'DocumentRetrieverByProjectID') {
    const projectId = args.projectId;
    
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    const document = MOCK_DOCUMENTS[projectId];
    
    if (!document) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: No document found for project ID: ${projectId}. Available project IDs are: ${Object.keys(MOCK_DOCUMENTS).join(', ')}`,
          },
        ],
      };
    }

    // Format the document content
    const formattedContent = `
# ${document.projectName} (${document.acronym})

**Project ID:** ${document.projectId}
**Country:** ${document.country}
**Region:** ${document.region}
**Approval Date:** ${document.approvalDate}
**Status:** ${document.status}

## Financial Information
- **Total Project Cost:** USD ${document.projectCost.toLocaleString()}
- **IFAD Financing:** USD ${document.ifadFinancing.toLocaleString()}

## Strategic Alignment
${document.sections.strategicAlignment}

## Development Objective
${document.sections.developmentObjective}

## Target Group
${document.sections.targetGroup}

## Project Components
${document.sections.components.map(comp => `
### ${comp.name}
- **Budget:** USD ${comp.budget.toLocaleString()}
- **Description:** ${comp.description}
`).join('\n')}
    `;

    return {
      content: [
        {
          type: 'text',
          text: formattedContent.trim(),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Document Retriever MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});