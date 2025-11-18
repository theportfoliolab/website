import { Intro } from "@/components/typography/intro"
import Section from "@/components/typography/section"
import Subsection from "@/components/typography/subsection"
import { Body, CodeBlock, Lead } from "@/components/typography/typography"

// NOTE: The original article source (articles/a1_ma_crossovers/article.txt) was read but
// appears empty in the workspace snapshot. This component follows the same structure
// as the PythonCsvTutorial and the other tutorial components. Replace the placeholder
// text below with the exact article wording from your article.

export default function MaCrossoversArticle() {
  return (
    <article className="prose w-full max-w-3xl mx-auto text-left">
      <Intro
        kicker="Article"
        title="MA Crossovers"
        description="A practical walkthrough of moving-average crossover strategies and how to implement them."
      >
        <Lead>
          Below is the article content. Replace the sections with the exact wording from your article file.
        </Lead>
      </Intro>

      <Section title="Introduction">
        <Subsection title="Overview">
          <Body>
            (Placeholder) Once your financial data is loaded into a DataFrame, the next step is almost always cleaning it.
            Real-world data — especially financial data — is rarely perfect. Missing values, inconsistent date formats,
            extra whitespace, or duplicated rows can all cause problems when performing calculations or visualisations.
            Replace this paragraph with the article's exact Intro text.
          </Body>
        </Subsection>
      </Section>

      <Section title="Setup">
        <Subsection title="Requirements">
          <Body>
            (Placeholder) To follow along, make sure you have Python, pandas and the example files. Replace with the
            exact Setup section from the article.
          </Body>
        </Subsection>
      </Section>

      <Section title="Strategy Description">
        <Subsection title="Moving averages & signals">
          <Body>
            (Placeholder) Explain the MA crossover logic, short and long windows, signal generation and position sizing.
            Replace with the article's exact wording.
          </Body>
        </Subsection>

        <Subsection title="Example code">
          <Body>
            The article includes example code (python) to compute moving averages and generate signals:
          </Body>
          <CodeBlock language="python">{`# example placeholder
import pandas as pd
df['MA10'] = df['Close'].rolling(10).mean()
df['MA30'] = df['Close'].rolling(30).mean()`}</CodeBlock>
        </Subsection>
      </Section>

      <Section title="Backtesting & Evaluation">
        <Subsection title="Performance metrics">
          <Body>
            (Placeholder) Describe performance measurement, cumulative returns, CAGR, drawdown analysis, etc.
          </Body>
        </Subsection>
      </Section>

      <Section title="Data & results">
        <Subsection title="Data used">
          <Body>
            (Placeholder) Mention the sample CSVs, any data cleaning steps and where results are stored.
          </Body>
        </Subsection>

        <Subsection title="Results">
          <Body>
            (Placeholder) Summarise experiment results and include references to result files or charts.
          </Body>
        </Subsection>
      </Section>

      <Section title="Summary">
        <Body>
          (Placeholder) Final paragraphs and takeaways. Replace with the exact Summary text from the article.
        </Body>
      </Section>
    </article>
  )
}