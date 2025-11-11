import { useState } from 'react'
import './App.css'
import {SamplePage} from './pages/SampleArticle.jsx'
import PageLayout from "./components/PageLayout.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
      <PageLayout>
        <SamplePage />
      </PageLayout>
  )
}

export default App
