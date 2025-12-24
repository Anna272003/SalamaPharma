import React, { useState } from 'react';
import EmployeController from "../Controllers/employeController";

function UpdateEmployeView({ employe, onUpdated }) {
    const [form, setForm] = useState({ ...employe });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await EmployeController.updateEmploye(form.id, form);
        if (response) {
            alert("Employé modifié avec succès");
            onUpdated();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Modifier employé ID: {form.id}</h3>
            <input name="nom" value={form.nom} onChange={handleChange} required /><br />
            <input name="prenom" value={form.prenom} onChange={handleChange} required /><br />
            <input name="date_naissance" type="date" value={form.date_naissance} onChange={handleChange} required /><br />
            <input name="date_embauche" type="date" value={form.date_embauche} onChange={handleChange} required /><br />
            <input name="salaire" value={form.salaire} onChange={handleChange} required /><br />
            <button type="submit">Mettre à jour</button>
        </form>
    );
}

export default UpdateEmployeView;