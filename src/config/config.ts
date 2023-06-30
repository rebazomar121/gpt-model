import "colors"
require("dotenv").config()
import express from "express"
const app = express()
const port = process.env.PORT || 1456 // default port to listen
const cors = require("cors")
const bodyParser = require("body-parser")

const config = () => {
  app.use(
    bodyParser.json({
      verify: (req: any, res: any, buf: any, encoding: any) => {
        if (buf && buf.length) {
          req.rawBody = buf.toString(encoding || "utf8")
        }
      },
    })
  )
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())

  app.use("/examples/llms", require("../examples/llms"))
  app.use("/examples/chat_models", require("../examples/chat_models"))


  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`.blue)
  })
}

export { config }
