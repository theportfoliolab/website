import Body from '../components/Body'
import Section from '../components/Section'
import CodeBlock from '../components/CodeBlock'
import ImageBlock from '../components/ImageBlock'
import DownloadButton from '../components/DownloadButton'

export default function SamplePage() {
  return (
    <Body>
      <h1>This is a sample article/tutorial</h1>

      <Section title="This is a sample section title">
        <p>This is a sample block of text. </p>
        <CodeBlock code={`import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df.head())`} />
      </Section>

      <Section title="Sample Image">
        <ImageBlock
          src="/src/assets/images/crossover_parameters.png"
          alt="Example chart"
          caption="A simple visualization"
        />
      </Section>
      <DownloadButton
        href="/assets/files/example_data.csv"
        label="Download sample CSV"
      />
    </Body>
  )
}
