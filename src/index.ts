import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'


const app = express()

app.use(cors())//serviços q vão executar
app.use(express.json())//serviços q vão executar tanto entrada com saida,n precisa ficar convertedo entrada e saida

app.listen(3003, () => { //configuração da porta
    console.log(`Servidor rodando na porta ${3003}`)
})



// ... configurações do express

app.get("/ping", async (req: Request, res: Response) => {
    try {				
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})