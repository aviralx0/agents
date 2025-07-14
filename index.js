#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';

// Mock document database
const MOCK_DOCUMENTS = {
  "2000004677": {
    projectId: "2000004677",
    projectName: "Promoting Rural Opportunities through Sustainable Production, Enterprise, and Resilience",
    acronym: "PROSPER",
    country: "India",
    region: "Asia and the Pacific",
    approvalDate: "2024-07-05",
    projectCost: 72280000,
    ifadFinancing: 45780000,
    status: "Concept Note",
    sections: {
      strategicAlignment: `
        PROSPER is aligned with IFAD's Strategic Framework 2016-2025 and responds to IFAD12 and IFAD13 priorities. 
        PROSPER contributes to achieving the objective of IFAD's COSOP 2018-24 for India by developing remunerative, 
        resilient, and sustainable smallholder food and agricultural production systems. The project also contributes 
        to the attainment of six SDG goals as described in the UNSDCF 2023-2027.

        The new State government has prioritised the agriculture and allied sectors, as reflected in its proposed 
        flagship programme "Handholding Scheme for Sustainable Livelihood" (HSSL), against the backdrop of which 
        the Government of Mizoram (GoM) is proposing PROSPER. HSSL encompasses the promotion of integrated farming, 
        value addition, access to finance, skill development, and market linkages, using improved livelihoods as 
        an incentive to adopt sustainable agricultural practices.

        PROSPER is well aligned with the broader development agenda of the Government of India (GoI), focusing on 
        sustainable agriculture, value chain development, and institutional capacity building to improve the 
        livelihoods of smallholder farmers, and doubling farmers' income. The project's interventions are 
        complementary to GoI initiatives like PM-DevINE and NESIDS, which invest in infrastructure for enhanced 
        connectivity in the North Eastern (NE) states.
      `,
      targetGroup: `
        Primary beneficiaries: 100,000 households (estimated population of 500,000 people) across all 11 districts of Mizoram
        - 95% of the population belonging to scheduled tribes (primarily Mizo, but also including Chakmas and Riangs)
        - 48,900 households originally part of FOCUS will continue benefiting from PROSPER
        - Three main target groups: (i) small and marginal farmers with less than 1.0 ha of land; (ii) landless farmers; and (iii) women and youth
        - 30% youth targeting, particularly through entrepreneurship/incubation activities
        - Special focus on women (26.7% of young women are unemployed against 11.1% of young men)
        - 7,000 landless farmer households covering 3,500 ha with long-term land leases
      `,
      developmentObjective: `
        PROSPER's goal is to contribute to economic prosperity and enhanced climate resilience in rural Mizoram. 
        The project development objective is to enhance the income and climate resilience of 100,000 households 
        across all 11 districts through agricultural value chains.

        The project will offer its target group options to enhance household income, nutrition security and 
        livelihoods resilience while sustaining land productivity and restoring the integrity of natural resources. 
        It will provide entry points for enhanced natural resource governance and management, and for the 
        introduction of innovative production technologies, including agroforestry and other agroecological practices.
      `,
      components: [
        {
          name: "Market Access and Enterprise Development",
          budget: 34700000,
          description: "Creation of a comprehensive ecosystem for improved market access through hub-and-spoke model, including value chain analysis, infrastructure development, processing and business capacity development, and ICT4D solutions for market intelligence."
        },
        {
          name: "Agricultural Productivity and Climate Resilience", 
          budget: 23130000,
          description: "Improving agricultural productivity and climate resilience through sustainable practices, IFS-CADA development, production clusters, soil and water conservation, irrigation infrastructure, farm mechanisation, and agroforestry promotion."
        },
        {
          name: "Project Management and Knowledge Management",
          budget: 14450000,
          description: "M&E, knowledge management, and project management functions to ensure effective implementation and learning across all project activities."
        }
      ],
      keyFeatures: `
        - Building on FOCUS project achievements and lessons learned
        - Hub-and-spoke model for market integration
        - Focus on climate-resilient agriculture and natural resource management
        - Emphasis on tribal community empowerment through FPIC processes
        - Integration of traditional Jhum practices with modern sustainable agriculture
        - Support for landless farmers through long-term lease arrangements
        - Youth entrepreneurship and women's empowerment initiatives
        - Agroforestry and carbon market participation
        - Community Animal Health Workers (CAHWs) and extension services
        - ICT4D solutions for market intelligence and digital extension
      `,
      implementationArrangement: `
        The project implementation structure leverages capacities and frameworks established during FOCUS implementation. 
        The Society for Climate Resilient Agriculture in Mizoram (SCRAM) under the Department of Agriculture remains 
        the lead implementing agency. The project is managed through a three-tier structure at state, district, and 
        village levels with governance through committees and management through PMU and District PMUs.

        Key governance structure:
        - State-level Project Steering Committee (SLPSC) chaired by Chief Secretary
        - State-level Programme Management Committee (SLPMC) chaired by Secretary of Agriculture  
        - District Level Coordination Committee (DLCC) chaired by Deputy Commissioner
        - Block Level Coordination Committee (BLCC) chaired by Block Development Officer
        
        Implementation period: 2025-2031 (6 years)
      `
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
  },
  "2000004922": {
    projectId: "2000004922",
    projectName: "Food System and Sustainable Transformation",
    acronym: "FAST",
    country: "Bangladesh",
    region: "Asia and the Pacific",
    approvalDate: "2024-08-23",
    projectCost: 210000000,
    ifadFinancing: 70000000,
    status: "Concept Note",
    sections: {
      strategicAlignment: `
        The FAST project aligns with Bangladesh's short, medium, and long-term plans, including the 8th Five-year Plan (2021-2025), Perspective Plan 2021-2041, and the Delta Plan 2100. It focuses on poverty reduction, agricultural diversification, employment creation, and climate adaptation. It is also aligned with the National Adaptation Plan (NAP), Mujib Climate Prosperity Plan, and contributes to SDGs 1, 2, 5, 6, 10, and 13, as well as the UN Sustainable Development Cooperation Framework (UNSDCF) 2022-26 and IFAD's COSOP 2024-2028.
      `,
      targetGroup: `
        The project targets an estimated 260,000 households (1.12 million people), prioritizing poverty-stricken and climate-vulnerable districts.
        - Beneficiary Breakdown: Very poor (30%), transitional poor (50%), and enterprising poor (20%).
        - Target Professions: Agricultural labour, artisans, marginal and small farmers, small producers, traders, and microenterprises.
        - Gender and Youth Focus: Women will constitute over 70% of financial service recipients, youth will be about 50%, and poor women-headed households will be about 15%.
      `,
      developmentObjective: `
        Goal: To sustainably increase the income, food security, and nutritional status of beneficiary households across selected agri-food and non-farm value chains.
        Objective: To transform the production system into a sustainable, climate-resilient, nutrition-sensitive and environment-friendly system for producers and the general population in project areas.
      `,
      components: [
        {
          name: "Ecology and Environment Friendly Food System Development",
          budget: 7000000,
          description: "Focuses on developing sustainable food systems in vulnerable areas through assessments of farming potential, ecology, market systems, and climate resilience. It includes a campaign for healthy food and WASH."
        },
        {
          name: "Financial services for value chain participants",
          budget: 195000000,
          description: "Provides access to capital for beneficiaries to start and expand production and businesses. Includes customized financial products like small credit for the extremely poor, seasonal loans, rural microcredit, and microenterprise loans."
        },
        {
          name: "Capacity building of PKSF and POs",
          budget: 1600000,
          description: "Enhances the capacity of Palli Karma-Sahayak Foundation (PKSF) and its Partner Organizations (POs) in climate change, environment, and food system development mainstreaming, including technical assistance and policy engagement."
        }
      ],
      keyFeatures: `
        - Comprehensive, market-led agri-food system approach emphasizing climate resilience and ecological sustainability.
        - Addresses multifaceted challenges including low productivity, limited market access, environmental degradation, and food safety concerns.
        - Integration of financial and non-financial services.
        - Development of customized loan products.
        - Strong focus on human health, nutrition, and food safety.
        - Capacity building for implementing partners (PKSF and POs).
        - Targeted interventions for women, youth, and the poorest households.
        - Leveraging lessons from previous IFAD projects like PACE and RMTP.
        - No initial grant funding, challenging Partner Organizations (POs) to innovate and deliver value within their loan portfolios.
      `,
      implementationArrangement: `
        The project is a non-ADP (Annual Development Plan) project.
        - Executing Agency (EA): Financial Institutions Division (FID) of the Ministry of Finance.
        - Implementing Agency (IA): Palli Karma-Sahayak Foundation (PKSF).
        - Oversight: A Project Steering Committee (PSC) chaired by the Secretary of FID/MOF.
        - Management: PKSF will establish a Project Management Unit (PMU) to lead implementation.
        - The project will collaborate with ongoing PKSF projects and coordinate with government agencies and development partners.
      `
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
        description: 'Retrieves project document content by project ID. Example usage: Call with {"projectId": "2000004677"} to get the document for project 2000004677.',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'The project ID as a string (e.g., "2000004677")',
            },
          },
          required: ['projectId'],
        },
      },
      {
        name: 'COSOPDocumentRetriever',
        description: 'Retrieves COSOP (Country Strategic Opportunities Programme) document by country name. Example usage: Call with {"country": "India"} to get the COSOP document for India.',
        inputSchema: {
          type: 'object',
          properties: {
            country: {
              type: 'string',
              description: 'The country name as a string (e.g., "India", "uganda", "KENYA" - case insensitive)',
            },
          },
          required: ['country'],
        },
      },
      {
        name: 'SectionExtractor',
        description: 'Extracts a specific section from a project document. Project ID is needed and the section name is needed in exact format. Valid section names (case sensitive): strategicAlignment, targetGroup, developmentObjective, components, keyFeatures, implementationArrangement, abbreviationsAndAcronyms. If you dont have project ID but have project name use DocumentRetrieverByAcronym first.',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'The project ID as a string (e.g., "2000004677")',
            },
            section: {
              type: 'string',
              description: 'The section name (case sensitive). Valid sections: strategicAlignment, targetGroup, developmentObjective, components, keyFeatures, implementationArrangement, abbreviationsAndAcronyms',
            },
          },
          required: ['projectId', 'section'],
        },
      },
      {
        name: 'DocumentRetrieverByAcronym',
        description: 'Retrieves project document by project acronym/name. Example usage: Call with {"projectName": "PROSPER"} to get the document for the PROSPER project.',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: {
              type: 'string',
              description: 'The project name or acronym as a string (e.g., "PROSPER", "FAST", "SAPEP")',
            },
          },
          required: ['projectName'],
        },
      },
      {
        name: 'GuidelineRetriever',
        description: 'Retrieves all UN and IFAD guideline documents. This includes IFAD Strategic Framework, IFAD Revised Operational Guidelines on Targeting, UN Cooperation Framework, and UNDAF Guidance. Example usage: Call with {} to get all guidelines.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'DocumentRetrieverByProjectID') {
    const projectId = args.projectId?.trim();
    
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
    const formattedContent = `=====
This is a Project Document for ${document.projectName} (${document.acronym}) retrieved from the DocumentRetrieverByProjectID tool.
=====

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

${document.sections.keyFeatures ? `## Key Features
${document.sections.keyFeatures}` : ''}

${document.sections.implementationArrangement ? `## Implementation Arrangement
${document.sections.implementationArrangement}` : ''}

=====
End of Project Document for ${document.projectName} (Project ID: ${document.projectId})
=====`;

    return {
      content: [
        {
          type: 'text',
          text: formattedContent.trim(),
        },
      ],
    };
  }

  if (name === 'COSOPDocumentRetriever') {
    const country = args.country?.trim()?.toLowerCase();
    
    if (!country) {
      throw new Error('Country name is required');
    }

    try {
      // Construct the file path
      const filePath = path.join('cosop', `${country}.md`);
      
      // Check if file exists and read it
      if (!fs.existsSync(filePath)) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: No COSOP document found for country: ${args.country}. Please check if the file exists at cosop/${country}.md`,
            },
          ],
        };
      }

      const cosopContent = fs.readFileSync(filePath, 'utf8');
      
      // Format the response with pretext and separators
      const formattedResponse = `=====
This is a COSOP (Country Strategic Opportunities Programme) document about ${args.country} retrieved from the COSOPDocumentRetriever tool.
=====

${cosopContent}

=====
End of COSOP document for ${args.country}
=====`;

      return {
        content: [
          {
            type: 'text',
            text: formattedResponse,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error reading COSOP document for ${args.country}: ${error.message}`,
          },
        ],
      };
    }
  }

  if (name === 'SectionExtractor') {
    const projectId = args.projectId?.trim();
    const section = args.section?.trim();
    
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    if (!section) {
      throw new Error('Section name is required');
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

    const validSections = ['strategicAlignment', 'targetGroup', 'developmentObjective', 'components', 'keyFeatures', 'implementationArrangement', 'abbreviationsAndAcronyms'];
    
    if (!validSections.includes(section)) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: Invalid section name: ${section}. Valid sections are: ${validSections.join(', ')}`,
          },
        ],
      };
    }

    const sectionContent = document.sections[section];
    
    if (!sectionContent) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: Section '${section}' not found in project ${projectId} (${document.projectName})`,
          },
        ],
      };
    }

    let formattedContent;
    
    if (section === 'components') {
      formattedContent = `=====
This is the '${section}' section from ${document.projectName} (${document.acronym}) retrieved from the SectionExtractor tool.
=====

# ${section} - ${document.projectName} (${document.acronym})

${sectionContent.map(comp => `
## ${comp.name}
- **Budget:** USD ${comp.budget ? comp.budget.toLocaleString() : 'N/A'}
- **Description:** ${comp.description}
`).join('\n')}

=====
End of '${section}' section from ${document.projectName} (Project ID: ${document.projectId})
=====`;
    } else {
      formattedContent = `=====
This is the '${section}' section from ${document.projectName} (${document.acronym}) retrieved from the SectionExtractor tool.
=====

# ${section} - ${document.projectName} (${document.acronym})

${sectionContent}

=====
End of '${section}' section from ${document.projectName} (Project ID: ${document.projectId})
=====`;
    }

    return {
      content: [
        {
          type: 'text',
          text: formattedContent.trim(),
        },
      ],
    };
  }

  if (name === 'DocumentRetrieverByAcronym') {
    const projectName = args.projectName?.trim();
    
    if (!projectName) {
      throw new Error('Project name is required');
    }

    // Find document by acronym or project name (case insensitive)
    const document = Object.values(MOCK_DOCUMENTS).find(doc => 
      doc.acronym.toLowerCase() === projectName.toLowerCase() || 
      doc.projectName.toLowerCase() === projectName.toLowerCase()
    );
    
    if (!document) {
      const availableAcronyms = Object.values(MOCK_DOCUMENTS).map(doc => doc.acronym).join(', ');
      const availableNames = Object.values(MOCK_DOCUMENTS).map(doc => doc.projectName).join(', ');
      return {
        content: [
          {
            type: 'text',
            text: `Error: No document found for project name/acronym: ${projectName}. Available acronyms: ${availableAcronyms}. Available project names: ${availableNames}`,
          },
        ],
      };
    }

    // Format the document content (reuse the same formatting as DocumentRetrieverByProjectID)
    const formattedContent = `=====
This is a Project Document for ${document.projectName} (${document.acronym}) retrieved from the DocumentRetrieverByAcronym tool.
=====

# ${document.projectName} (${document.acronym})

**Project ID:** ${document.projectId}
**Country:** ${document.country}
**Region:** ${document.region}
**Approval Date:** ${document.approvalDate}
**Status:** ${document.status}

## Financial Information
- **Total Project Cost:** USD ${document.projectCost ? document.projectCost.toLocaleString() : 'N/A'}
- **IFAD Financing:** USD ${document.ifadFinancing ? document.ifadFinancing.toLocaleString() : 'N/A'}

## Strategic Alignment
${document.sections.strategicAlignment}

## Development Objective
${document.sections.developmentObjective}

## Target Group
${document.sections.targetGroup}

## Project Components
${document.sections.components.map(comp => `
### ${comp.name}
- **Budget:** USD ${comp.budget ? comp.budget.toLocaleString() : 'N/A'}
- **Description:** ${comp.description}
`).join('\n')}

${document.sections.keyFeatures ? `## Key Features
${document.sections.keyFeatures}` : ''}

${document.sections.implementationArrangement ? `## Implementation Arrangement
${document.sections.implementationArrangement}` : ''}

${document.sections.abbreviationsAndAcronyms ? `## Abbreviations and Acronyms
${document.sections.abbreviationsAndAcronyms}` : ''}

=====
End of Project Document for ${document.projectName} (Project ID: ${document.projectId})
=====`;

    return {
      content: [
        {
          type: 'text',
          text: formattedContent.trim(),
        },
      ],
    };
  }

  if (name === 'GuidelineRetriever') {
    try {
      const guidelinesDir = path.join('guidelines');
      
      // Check if guidelines directory exists
      if (!fs.existsSync(guidelinesDir)) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: Guidelines directory not found.',
            },
          ],
        };
      }

      // Read all .md files from guidelines directory
      const files = fs.readdirSync(guidelinesDir).filter(file => file.endsWith('.md'));
      
      if (files.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: No guideline files found in guidelines directory.',
            },
          ],
        };
      }

      // Read all guideline files and combine them
      let combinedContent = `=====
These are UN/IFAD guideline documents retrieved from the GuidelineRetriever tool. These are guidelines from the UN that include UNDAF, IFAD Strategic Framework, IFAD Revised Operational Guidelines on Targeting, and UN Cooperation Framework. These documents are very long - try to infer the knowledge relevant from this chunk.
=====

`;

      files.forEach((file, index) => {
        const filePath = path.join(guidelinesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = file.replace('.md', '').replace(/_/g, ' ');
        
        combinedContent += `
# ${fileName} Guidelines

${content}

${index < files.length - 1 ? '---\n' : ''}`;
      });

      combinedContent += `
=====
End of all UN/IFAD guidelines documents
=====`;

      return {
        content: [
          {
            type: 'text',
            text: combinedContent,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error reading guideline documents: ${error.message}`,
          },
        ],
      };
    }
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
