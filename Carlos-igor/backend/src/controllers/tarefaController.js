import Tarefa from "../models/tarefaModel.js";
import { z } from "zod";
import { response } from "express";

const createSchema = z.object({
     tarefa: z.string({
          invalid_type_error: "A tarefa deve ser um texto",
          required_error: "Tarefa é obrigatória"
     })
          .min(3, { message: "a tarefa deve conter pelo menos 3 caracteres" })
          .max(255, { message: "a tarefa deve conter no máximo 255 caracteres" }),
})

const idSchema = z.object({
     id: z.string().uuid({message: "Id inválido"}) 
})

 const updateSchema = z.object({
          tarefa: z
          .string()
          .min(3, { message: "A tarefa deve conter no mínimo 3 caracteres"})
          .max(255, {message: "A tarefa deve conter no maximo 255 caracteres"}),
          status: z.enum(["pendente", "concluida"])
})

const situacaoSchema = z.object({
     situacao: z.enum(["pendente", "concluida"]),
})
//ok
export const create = async (req, res) => {

     const createValidation = createSchema.safeParse(req.body);
     if (!createValidation.success) {
          res.status(400).json(createValidation.error)
          return
     }
     const { tarefa } = createValidation.data;
     const descricao = req.body?.descricao || null //opcional

     const novaTarefa = {
          tarefa,
          descricao
     }

     try {
          const insertTarefa = await Tarefa.create(novaTarefa)
          res.status(201).json(insertTarefa)
     } catch (error) {
          console.error(error)
          res.status(500).json({ err: "Erro ao cadastrar tarefa" })
     }
};
//GET -> 7777/api/tarefas?page=1&limit=10
export const getAll = async (req, res) => {
     const page = parseInt(req.query.page) || 1
     const limit = parseInt(req.query.limit) || 10
     const offset = (page - 1) * 10 //offset serve para limitar a qauntidade de linhas

     try {
          const tarefas = await Tarefa.findAndCountAll({
               limit,
               offset,
          })

          const totalPaginas = Math.ceil(tarefas.count / limit)

          res.status(200).json({
               totalTarefas: tarefas.count,
               totalPaginas,
               paginaAtual: page,
               itensPorPagina: limit,
               proximaPagina: totalPaginas === 0 ? null : `http://localhost:7777/api/tarefas/page=${page + 1}`,
               tarefas: tarefas.rows
          })   
     } catch (error) {
          console.error(error)
          res.status(500).json({ err: "deu erro buscando moral" })
     }
};
//ok
export const getTarefa = async (req, res) => {
     const idValidation = idSchema.safeParse(req.params)
     if(!idValidation.success) {
          res.status(400).json({message: idValidation.error})
          return
     }
     const id = idValidation.data.id; 
     try{
          const tarefa = await Tarefa.findByPk(id)
          if(!tarefa){
               res.status(404).json({err: "Tarefa não encontrada"})
               return
          }
          res.status(200).json(tarefa)
     }catch (error) {
          console.error(error)
          res.status(500).json({err: "Erro ao buscar Tarefa"})
     }
// const {id} = req. params

//      const tarefa = await Tarefa.findByPk(id);
//      if (tarefa === null) {
//           console.log('Not found!');
//      } else {
//           console.log(tarefa instanceof Tarefa); // true
//      res.status(200).json(tarefa)  
//      }
};
//ok
export const updateTarefa = async (req, res) => {
     const idValidation = idSchema.safeParse(req.params)
     if(!idValidation.success) {
          res.status(400).json({message: idValidation.error})
          return
     }
     const id = idValidation.data.id;

     const updateValidation = updateSchema.safeParse(req.body)
     if(!updateValidation.success) {
          res.status(400).json({message: idValidation.error})
          return
     }
     const {tarefa, status} = updateValidation.data
     const descricao =  req.body.descricao || ""

     const tarefaAtualizada = {
          tarefa,
          descricao,
          status
     }

     try {
          const [numAffectedRow] = await Tarefa.update(tarefaAtualizada, {
               where: {id},
          })
          if(numAffectedRow <= 0){
               res.status(404).json({err: "Tarefa não encontrada"})
               return
          }
          res.status(200).json({message: "Tarefa atualixada com  sucesso!"})
     } catch (error) {
          console.error(error)
          res.status(500).json
     }
};
//ok
export const updateStatusTarefa = async (req, res) => {
     const idValidation = idSchema.safeParse(req.params)
     if(!idValidation.success) {
          res.status(400).json({message: idValidation.error})
          return
     }
     const id = idValidation.data.id;
     try{
          const tarefa = await Tarefa.findOne({raw: true ,where: {id} })
          if(!tarefa){
               res.status(404).json({err: "Tarefa não encontrada"})
               return
          }

          if(tarefa.status === 'pendente'){
          await Tarefa.update({status: 'concluida'},{where : {id}})
          }else if(tarefa.status === 'concluida'){
          await Tarefa.update({status: 'pendente'},{where : {id}})
          
     }
          const tarefaAtualizada = await Tarefa.findOne({
               where: {id},
               attributes: ["id", "status"],
          });
          res.status(200).json(tarefaAtualizada)
     }catch(error){
          console.error(error)
          res.status(500).json({err: "Erro ao atualizar tarefa"})
     }
};

export const getTarefaStatus = async (req, res) => {
     const situacaoValidation = situacaoSchema.safeParse(req.params)
     if(!situacaoValidation.success){
          res.status(400).json({err: situacaoValidation.error})
     }
     const {situacao} = situacaoValidation.data;
     try {
          const tarefas = await Tarefa.findAll({where: {status: situacao}});
          res.status(200).json(tarefas)
     } catch (error) {
          console.log(error)
          res.status(500).json({err: "Error ao buscar tarefas por situação"})
     }
     
};
//ok
export const deleteTarefa = async (req, res) => {
     const idValidation = idSchema.safeParse(req.params)
     if(!idValidation.success) {
          res.status(400).json({message: idValidation.error})
          return
     }
     const id = idValidation.data.id;

     try{
          const tarefaDeletada = await Tarefa.destroy({
               where: {id},
          });
          if(tarefaDeletada === 0){
               res.status(404).json({message: "Tarefa não existe!"})
               return
          }
          res.status(200).json({message: "Tarefa excluida"});
     }catch(error){
          console.log(error)
          res.status(500).json({message: "Erro ao excluir Tarefa"})
     }
     
};