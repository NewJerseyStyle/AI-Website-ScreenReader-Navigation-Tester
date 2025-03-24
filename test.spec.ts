#! /usr/bin/env node
import * as fs from 'fs';
import { nvdaTest as test } from "@guidepup/playwright";
import { expect } from "@playwright/test";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

const url = process.env.TEST_ENTRY_URL;
const filePath = process.env.TEST_CASE_JSON_PATH || "example-goals.json";

if (!url) {
  console.error("TEST_ENTRY_URL is not defined in the environment variables.");
  process.exit(1);
}
(async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch URL: ${url}. Status: ${response.status} ${response.statusText}`);
      process.exit(1);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      console.error(`The URL does not return HTML content. Content type: ${contentType}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error fetching URL: ${url}. ${error.message}`);
    process.exit(1);
  }
})();

try {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  try {
    const parsedData = JSON.parse(fileContents);
    if (!Array.isArray(parsedData)) {
      throw new Error('The JSON file must contain an array.');
    }
    parsedData.forEach(item => {
      if (typeof item !== 'object' || item === null || !('goal' in item)) {
        throw new Error('Each element in the array must be an object with "goal" property.');
      }
    });
  } catch (parseError) {
    console.error("Invalid JSON file format:", parseError.message);
    process.exit(1);
  }
} catch (error) {
  console.error("Invalid JSON file provided:", error.message);
  process.exit(1);
}

const llm = new ChatGroq({
  model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  temperature: parseFloat(process.env.GROQ_MODEL_TEMP || "0")
});

const model = new ChatGroq({
  model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
}).bind({
  response_format: { type: "json_object" },
});

test.describe("Playwright NVDA", () => {
  if (filePath) {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      const parsedData = JSON.parse(fileContents);
  
      parsedData.forEach(item => {
        test(item.goal, async ({
          page,
          nvda,
        }) => {
          // Navigate to Guidepup GitHub page
          await page.goto(url, {
            waitUntil: "load",
          });
      
          // Wait for page to be ready and setup
          const header = page.locator('header');
          await header.waitFor();
      
          // Interact with the page
          await nvda.navigateToWebContent();
          
          const keyboardNaviNextItemTool = tool(
            async () => {
              await nvda.next();
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "next_item_function",
              description: "Move to the next item.",
            }
          );
          
          const reportDateTimeTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.reportDateTime);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "report_date_time_function",
              description: "Report the current date and time.",
            }
          );

          const reportCurrentFocusTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.reportCurrentFocus);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "report_current_focus_function",
              description: "Report the currently focused element.",
            }
          );

          const reportTitleTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.reportTitle);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "report_title_function",
              description: "Report the title of the current window.",
            }
          );

          const readActiveWindowTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.readActiveWindow);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "read_active_window_function",
              description: "Read the content of the active window.",
            }
          );

          const readLineTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.readLine);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "read_line_function",
              description: "Read the current line.",
            }
          );

          const moveToNextHeadingTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToNextHeading);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_next_heading_function",
              description: "Move to the next heading.",
            }
          );

          const moveToPreviousHeadingTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToPreviousHeading);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_previous_heading_function",
              description: "Move to the previous heading.",
            }
          );

          const moveToNextLinkTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToNextLink);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_next_link_function",
              description: "Move to the next link.",
            }
          );

          const moveToPreviousLinkTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToPreviousLink);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_previous_link_function",
              description: "Move to the previous link.",
            }
          );

          const moveToNextButtonTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToNextButton);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_next_button_function",
              description: "Move to the next button.",
            }
          );

          const moveToPreviousButtonTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToPreviousButton);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_previous_button_function",
              description: "Move to the previous button.",
            }
          );

          const moveToNextFormFieldTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToNextFormField);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_next_form_field_function",
              description: "Move to the next form field.",
            }
          );

          const moveToPreviousFormFieldTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToPreviousFormField);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_previous_form_field_function",
              description: "Move to the previous form field.",
            }
          );

          const moveToNextLandmarkTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToNextLandmark);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_next_landmark_function",
              description: "Move to the next landmark.",
            }
          );

          const moveToPreviousLandmarkTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToPreviousLandmark);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_previous_landmark_function",
              description: "Move to the previous landmark.",
            }
          );

          const moveToNextTableTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToNextTable);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_next_table_function",
              description: "Move to the next table.",
            }
          );

          const moveToPreviousTableTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToPreviousTable);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_previous_table_function",
              description: "Move to the previous table.",
            }
          );

          const moveToNextListTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToNextList);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_next_list_function",
              description: "Move to the next list.",
            }
          );

          const moveToPreviousListTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToPreviousList);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_previous_list_function",
              description: "Move to the previous list.",
            }
          );

          const moveToNextSeparatorTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToNextSeparator);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_next_separator_function",
              description: "Move to the next separator.",
            }
          );

          const moveToPreviousSeparatorTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToPreviousSeparator);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_previous_separator_function",
              description: "Move to the previous separator.",
            }
          );

          const moveToNextTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToNext);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_next_function",
              description: "Move to the next item.",
            }
          );

          const moveToPreviousTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.moveToPrevious);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "move_to_previous_function",
              description: "Move to the previous item.",
            }
          );

          const performDefaultActionForItemTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.performDefaultActionForItem);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "perform_default_action_for_item_function",
              description: "Perform the default action for the current item.",
            }
          );

          const leftMouseClickTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.leftMouseClick);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "left_mouse_click_function",
              description: "Perform a left mouse click.",
            }
          );

          const rightMouseClickTool = tool(
            async () => {
              await nvda.perform(nvda.keyboardCommands.rightMouseClick);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "right_mouse_click_function",
              description: "Perform a right mouse click.",
            }
          );
          
          
          const typeInTool = tool(
            async (input) => {
              await page.keyboard.type(input);
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "keyboard_function",
              description: "Type in the given text to browser.",
              schema: z.object({
                input: z.string(),
              }),
            }
          );

          const pressEnterTool = tool(
            async () => {
              await page.keyboard.press('Enter');
              return await nvda.lastSpokenPhrase();
            },
            {
              name: "keyboard_press_enter_function",
              description: "Press enter on keyboard.",
            }
          );

          const tools = [
            keyboardNaviNextItemTool,
            reportDateTimeTool,
            reportCurrentFocusTool,
            reportTitleTool,
            readActiveWindowTool,
            readLineTool,
            moveToNextHeadingTool,
            moveToPreviousHeadingTool,
            moveToNextLinkTool,
            moveToPreviousLinkTool,
            moveToNextButtonTool,
            moveToPreviousButtonTool,
            moveToNextFormFieldTool,
            moveToPreviousFormFieldTool,
            moveToNextLandmarkTool,
            moveToPreviousLandmarkTool,
            moveToNextTableTool,
            moveToPreviousTableTool,
            moveToNextListTool,
            moveToPreviousListTool,
            moveToNextSeparatorTool,
            moveToPreviousSeparatorTool,
            moveToNextTool,
            moveToPreviousTool,
            performDefaultActionForItemTool,
            leftMouseClickTool,
            rightMouseClickTool,
            typeInTool,
            pressEnterTool
          ];

          // maybe put the goal in system prompt will be better?
          const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a tester, navigate the website using screen reader try your best to understand the website and finish the given task, home page is opened for you."],
            ["placeholder", "{chat_history}"],
            ["human", "{input}"],
            ["placeholder", "{agent_scratchpad}"],
          ]);

          const agent = createToolCallingAgent({
            llm,
            tools,
            prompt,
          });
          const agentExecutor = new AgentExecutor({
            agent,
            tools,
          });

          let agentOutput = await agentExecutor.invoke({ input: item.goal });

          if ('expect' in item) {
            const aiMsg = await model.invoke(
              "# task: Judge and return JSON with property 'conclusion' as true or false\n# Problem: Does the conclusion of the agent align with our expectated intepretation?\n# Expectation: " + item.expect + "\n# Context: " + agentOutput.messages[agentOutput.messages.length - 1].content
            );
            // console.log(aiMsg.content);
            const aiMsgContent = JSON.parse(aiMsg.content);
            expect(aiMsgContent.conclusion).toBe(true);
          } else {
            const the_log = await nvda.spokenPhraseLog();
            const aiMsg = await model.invoke(
              "# task: Judge and return JSON with property'conclusion' as true or false\n# Problem: Based on the log, did agent achieve its goal?\n# Expectation: " + item.goal + "\n# The Log: " + the_log
            );
            // console.log(aiMsg.content);
            const aiMsgContent = JSON.parse(aiMsg.content);
            expect(aiMsgContent.conclusion).toBe(true);
          }
        });
      });
    } catch (error) {
      // Error already handled above, but this is here for completeness.
      console.error("Error reading or parsing JSON file.");
    }
  }
  
});
