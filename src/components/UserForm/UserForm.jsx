import './userForm.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
export default function UserForm() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('https://luckywheelbackend.onrender.com/users/get')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            email: event.target.email.value,
           // cuit: event.target.cuit.value,
            phone: event.target.phone.value,
           // rubro: event.target.rubro.value,
            //company: event.target.company.value,
        }
        
        const userExists = users.some((user) => user.email === data.email);
        
        if (userExists) {
            alert('This email already used!');
            // Evitar que se guarde el usuario y salir
            return;
        }
        localStorage.setItem('formData', JSON.stringify(data));

        console.log(localStorage.getItem('formData'));
        fetch('https://luckywheelbackend.onrender.com/users/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            localStorage.setItem('user', JSON.stringify({
                ...data, spinCount: 0
            }));
            window.location.href = '/lucky-wheel';
        })
        .catch(error => console.error('Error:', error));
        
    }
    return (
        <div className="user-form-container">
            <div className='logo-container'>
                {/* <img src='/css/festivalbanner.jpg' alt="logo" style={{width:"100%"}}/> */}
                {/* <h1 className='user-form-title'>+ PYME</h1> */}
            </div>
            <h2 className='user-form-title'>Play With Us and Win Amazing Prizes!</h2>
            <form className="user-form" onSubmit={handleSubmit}>
                <div className='names-input-container'>
                    <input type="text" placeholder="First Name" name="first_name" required/>
                    <input type="text" placeholder="Last Name" name="last_name" required/>
                </div>
                <input type="email" placeholder=" Enter Email" name="email" required/>
                <input type='phone' placeholder='Phone Number' name='phone'  required/>
                {/*<input type='number' placeholder='CUIT/CUIL' name='cuit'  required/>
            
                <select name='rubro' required>
                    <option value=''>Rubro*</option>
                    <option value='Emprendedor'>Emprendedor</option>
                    <option value='Profesional'>Profesional</option>
                    <option value='Duenio'>Dueño</option>
                    <option value='Estudiante'>Estudiante</option>
                    <option value='Otro'>Otro</option>
                </select>
                <input type='text' placeholder='Empresa' name='company' />*/}
                <button className="user-form-submit-button" type="submit">Play and Win</button>
            </form>
            
        </div>
    )
}