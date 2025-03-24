# AI Website Navigation Testing
Proof of concept for an AI-powered system that uses a screen reader to assess the user experience (UX) of a website for users with visual impairments. The AI simulates human interaction, providing a report on achieved and failed goals, focusing on ease of use and accessibility.

## Project Overview

The project aims to automate the process of verifying website accessibility and UX by using a screen reader to interact with the website and extract information about the completion status of specific tasks or goals. The AI component analyzes the screen reader output to identify whether each goal was successfully achieved or not, and provides insights into potential usability issues.

## Goals

The specific goals to be achieved by the system are defined in a configuration file (e.g., `goals.json`).  An example might include:

* Navigate to the homepage.
* View the homepage and guess what the site is about.
* Submit the contact form.
* Access the FAQ section and find info about payment method.


## Technology Stack

* **Programming Language:** Javascript
* **Screen Reader:** NVDA
* **AI Libraries:** Langchain, Zod
* **Webdriver:** Playwright


## Setup and Usage

1. **Install Dependencies:** 
   - Ensure you have Node.js and npm installed.
   - Install the project dependencies by running: `npm install` in the project directory. This will install all necessary packages listed in `package.json`.
2. **Configure Goals:** 
   - Create a JSON file (e.g., `example-goals.json`) to define the testing goals. 
   - Each goal should be an object in an array with a `"goal"` property. Optionally, you can include an `"expect"` property for expected outcomes.
   - Example `example-goals.json`:
     ```json
     [
         {
             "goal": "Navigate to the homepage."
         },
         {
             "goal": "View the homepage and guess what the site is about.",
             "expect": "It is the source code repository of software."
         }
     ]
     ```
3. **Run the Script:**
   - Create a `.env` file in the project directory and add your Groq API key and model information:
     ```env
     GROQ_API_KEY=your-api-key
     GROQ_MODEL=llama-3.3-70b-versatile
     GROQ_MODEL_TEMP=0
     ```
   - Execute the `index.js` script using Node.js, providing the target URL and the path to your goals JSON file as arguments:
     ```bash
     node index.js <URL_to_test> -f <path_to_goals_json_file>
     ```
     For example:
     ```bash
     node index.js https://github.com/guidepup/guidepup -f example-goals.json
     ```

## Results

The output will be a simple report detailing:

* **Successfully Achieved Goals:** A list of goals that were successfully completed.
* **Failed Goals:** A list of goals that were not successfully completed, along with potential reasons for failure (if identified).  This section should provide actionable feedback for improving the website's accessibility and UX.
* **Accessibility Issues:** A list of identified accessibility issues, such as missing alt text or poor semantic HTML.

## User Experience Considerations

This proof-of-concept prioritizes ease of use for both the AI and human users. The AI's actions are designed to mimic the natural flow of a human user interacting with a website using a screen reader. The system's design aims to be intuitive and straightforward, minimizing any complexities that might hinder accessibility for users with disabilities.  Future development will focus on user testing to further refine the UX and ensure accessibility for a wide range of users.

## Testing Methodology

The AI testing methodology is designed to simulate real-world user interactions. This includes:

* **Realistic Navigation:** The AI navigates the website using screen reader commands that a human user would typically employ.
* **Error Handling:** The system incorporates robust error handling to gracefully manage unexpected situations, such as broken links or unexpected website changes.
* **Accessibility Checks:** Beyond goal completion, the system also performs basic accessibility checks, such as verifying the presence of appropriate ARIA attributes and semantic HTML.

## Limitations

The AI testing system only consider keyboard navigation. Do not provide insights in touch screen and may need more instruction in order to control the behavior to mimic specific operation styles (e.g. reading each element on website vs jumping to next header).

## Contributing

Contributions are welcome! Please feel free to submit pull requests.
