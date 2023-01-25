import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import { TUserDB } from './type'


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
//get all users
app.get("/users", async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined

        if(searchTerm === undefined){
            const result = await db("users")
            res.status(200).send(result)
        }else{
            const result = await db("users").where("name","LIKE", `%${searchTerm}%`)
            res.status(200).send(result)
        }

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
//creat users
app.post("/users", async (req: Request, res: Response) => {
    try {
        const{id, name, email, password } = req.body

        if (typeof id !== "string"){  
            res.status(400)
            throw new Error (" 'id' deve ser string")
        }
       
        if (id.length <4 ){
            res.status(400)
            throw new Error (" 'id' deve possuir pelo menos caracters ")
        }

        if (typeof name !== "string"){  
            res.status(400)
            throw new Error (" 'name' deve ser string")
        }
       
        if (name.length < 2){
            res.status(400)
            throw new Error (" 'name' deve possuir pelo menos caracters ")
        }
        if (typeof email !== "string"){  
            res.status(400)
            throw new Error (" 'email' deve ser string")
        }
       
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}

        const [ userIdAlreadyExists ]: TUserDB[] | undefined[] = await db("users").where({id})

        if(userIdAlreadyExists){
            res.status(400)
            throw new Error("'Id' já existe")

        }
        const [ userEmailAlreadyExists ]: TUserDB[] | undefined[] = await db("users").where({email})

        if(userEmailAlreadyExists){
            res.status(400)
            throw new Error("'Email' já existe")
        }

        const newUser: TUserDB = {
            id,
            name,
            email,
            password
        }
        await db("users").insert(newUser)

        res.status(201).send({message: "User criado com sucesso",
        user: newUser
    })

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