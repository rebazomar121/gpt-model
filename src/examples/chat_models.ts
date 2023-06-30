import express from "express"

import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain } from "langchain/chains"
import { BufferMemory } from "langchain/memory"
import { ConversationChain } from "langchain/chains"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { HumanChatMessage, SystemChatMessage } from "langchain/schema"

const router = express.Router()

// this is one chat for ai we don't use model from here we use ChatOpenAI
router.post("/one-chat/:text", async (req, res) => {
  try {
    const { text } = req.params
    const chat = new ChatOpenAI({ temperature: 0 })
    const response = await chat.call([new HumanChatMessage(text)])
    return res.status(200).send({
      message: "Success",
      response,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: "Internal server error",
      error: error,
    })
  }
})

router.post("/SystemChatMessage/:text", async (req, res) => {
  try {
    const { text } = req.params
    const chat = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      maxTokens: 20,
      maxRetries: 20,
    })
    // from SystemChatMessage we can make text to help the user with it
    const response = await chat.call([
      new SystemChatMessage(
        "You are a helpful assistant that translates English to Kurdish."
      ),
      new HumanChatMessage(text),
    ])
    return res.status(200).send({
      message: "Success",
      response,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: "Internal server error",
      error: error,
    })
  }
})

router.post("/SystemChatMessageMultiple", async (req, res) => {
  try {
    const chat = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      maxTokens: 20,
      maxRetries: 20,
    })
    const response = await chat.generate([
      [
        new SystemChatMessage(
          "You are a helpful assistant that translates English to French."
        ),
        new HumanChatMessage(
          "Translate this sentence from English to French. I love programming."
        ),
      ],
      [
        new SystemChatMessage(
          "You are a helpful assistant that translates English to French."
        ),
        new HumanChatMessage(
          "Translate this sentence from English to French. I love artificial intelligence."
        ),
      ],
    ])

    return res.status(200).send({
      message: "Success",
      response,
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
