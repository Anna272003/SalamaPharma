import React, { useEffect, useState } from "react";
import EmployeController from "../Controllers/employeController";

function EmployeListView({ onEdit })  {

    const [employes,setEmployes]=useState([])
    const [moyenne,setMoyenne]=useState(0)
    const [tri,setTri]=useState([])
    const [retraites,setRetraites]=useState([])
    const [salaires,setSalaires] = useState([])

    const fetchEmployes = async()=>{
            const data = await EmployeController.getEmploye();
            setEmployes(data)
    }
    const deleteEmploye = async(id)=>{
        if(window.confirm("Etes vous sure de supprimer cette employé?")){
            await EmployeController.deleteEmploye(id)
            fetchEmployes()
        }
    }
    useEffect(()=>{
        EmployeController.getAgeMoyenne().then(setMoyenne)
        EmployeController.getTrieAnciennete().then(setTri)
        EmployeController.getRetraite().then(setRetraites)
        EmployeController.getTriSalaire().then(setSalaires)
        fetchEmployes()
    },[])
    return(
        <div>
            <h2>Liste des employés</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Date Naissance</th>
                        <th>Date Embauche</th>
                        <th>Salaire</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employes.map((e) => (
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.Nom}</td>
                            <td>{e.Prenom}</td>
                            <td>{e.Date_naissance.substring(0, 10)}</td>
                            <td>{e.Date_embauche.substring(0, 10)}</td>
                            <td>{e.salaire}</td>
                            <td>
                                <button onClick={() => onEdit(e)}>Modifier</button>
                                <button onClick={()=>deleteEmploye(e.id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <p>L'age moyenne des employés est {moyenne} ans  </p>
            </div>
            <div>
                <p>Les employés trier par Anciennete </p>
                <ul>
                    {tri.map((index,item)=>(
                        <li key={item}>{index.Nom} {index.Prenom} qui est embauché le {index.Date_embauche.substring(0,10)} </li>
                    ))}
                </ul>
            </div>
            <div>
                <p>Les personnes retraiter sont :</p>
                <ul>
                    {retraites.map((index,item)=>(
                        <li key={item}>{index.Nom} {index.Prenom} - {index.Date_naissance.substring(0,10)} </li>
                    ))}
                </ul>
            </div>
            <div>
                <p>trie de salaire </p>
                <ul>
                    {salaires.map((index,item)=>(
                        <li key={item}>{index.Nom} {index.Prenom} - {index.salaire} </li>
                    ))}
                </ul>
            </div>
        </div>

    )
 }
export default EmployeListView;