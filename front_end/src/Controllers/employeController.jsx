import EmployeModel from '../Models/employeModel'
import API from "../Services/api"

const EmployeController = {
    getEmploye : async() =>{
        try{
            const response = await API.get("/getEmploye")
            return EmployeModel.parseList(response.data)
        }
        catch(error){
            console.error('aucun employé trouver dans la base de donnée',error)
            return [];
        }
    },
    getAgeMoyenne : async()=>{
        try{
            const response = await API.get("/ageMoyenne")
            return response.data.ageMoyenne
        }catch(error){
            console.error("Erreur age Moyenne",error)
            return 0
        }
    },
    getTrieAnciennete : async()=>{
        try{
            const response = await API.get("/triAnciennete")
            return response.data
        }catch(error){
            console.error("Erreur consernant le trie pas encienneté",error)
            return[]
        }
    },
    getRetraite : async()=>{
        try{
            const response = await API.get("/retraite")
            return response.data.retraite 
        }catch(error){
            console.error("Les personnes retraiter son introuvable")
            return []
        }
    },
    getTriSalaire : async()=>{
        try{
            const response = await API.get("/triSalaire")
            return response.data
        }catch(error){
            console.error("Erreur concernant le tri des salaire",error)
            return []
        }
    },
    addEmploye: async (employe) => {
        try {
            const res = await API.post("/postEmploye", employe);
            return res.data;
        } catch (error) {
            console.error("Erreur ajout employé:", error);
            return null;
        }
    },
    updateEmploye: async (id, employe) => {
        try {
            const res = await API.put(`/putEmploye/${id}`, employe);
            return res.data;
        } catch (error) {
            console.error("Erreur modification employé:", error);
            return null;
        }
    },
    deleteEmploye : async(id)=>{
        try{
            const response = await API.delete(`/deleteEmploye/${id}`)
            return response.data
        }catch(error){
            console.error("Probleme de suppression de l'employé",error)
            return null
        }
    }
}

export default EmployeController;