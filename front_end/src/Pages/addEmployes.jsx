import React, { useState } from 'react';
import EmployeController from "../Controllers/employeController";

function AddEmployeView({ onEmployeAdded }) {
    const [form, setForm] = useState({
        id: '',
        nom: '',
        prenom: '',
        date_naissance: '',
        date_embauche: '',
        salaire: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await EmployeController.addEmploye(form);
        if (response) {
            alert("Employé ajouté avec succès");
            onEmployeAdded();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Ajouter un employé</h3>
            <input name="id" placeholder="ID" onChange={handleChange} required /><br />
            <input name="nom" placeholder="Nom" onChange={handleChange} required /><br />
            <input name="prenom" placeholder="Prénom" onChange={handleChange} required /><br />
            <input name="date_naissance" type="date" onChange={handleChange} required /><br />
            <input name="date_embauche" type="date" onChange={handleChange} required /><br />
            <input name="salaire" placeholder="Salaire" onChange={handleChange} required /><br />
            <button type="submit">Ajouter</button>
        </form>
    );
}

export default AddEmployeView;