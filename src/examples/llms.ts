import express from "express"

import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain } from "langchain/chains"
import { BufferMemory } from "langchain/memory"
import { ConversationChain } from "langchain/chains"

const router = express.Router()

// basic LLM model this request will base with tell the company name by telling the name of job
router.post("/company/:company", async (req, res) => {
  try {
    const { company } = req.params
    // define the model
    const model = new OpenAI({
      temperature: 0.9,
      modelName: "gpt-3.5-turbo",
      maxTokens: 15,
      maxRetries: 15,
    })
    // the context of prompt
    const template = "What is a good name for a company that makes {company}?"
    // created prompt
    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ["company"],
    })
    // create the chain we need to use chain to call the api
    const chain = new LLMChain({ llm: model, prompt: prompt })
    // try to call the cain
    const response = await chain.call({ company })
    // return the response
    return res.status(200).send({
      message: "Success",
      response: response,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: "Internal server error",
      error: error,
    })
  }
})

// this one use to make ConversationChain like asking the question (but the memory dose not work)
router.post("/tellName/:input", async (req, res) => {
  try {
    const { input } = req.params
    // define the model
    const model = new OpenAI({
      temperature: 0.9,
      modelName: "gpt-3.5-turbo",
      maxTokens: 10,
      maxRetries: 20,
    })

    const memory = new BufferMemory({
      memoryKey: "history",
    })
    const chain = new ConversationChain({ llm: model, memory })
    const response = await chain.call({ input })
    return res.status(200).send({
      message: "Success",
      response: response,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: "Internal server error",
      error: error,
    })
  }
})

module.exports = router
