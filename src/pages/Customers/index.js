import { useState } from 'react'
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser } from 'react-icons/fi';

import { db } from '../../services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'

import { toast } from 'react-toastify';

export default function Customers(){

    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [enderoco, setEnderoco] = useState('');

    async function handleRegister(e){
        e.preventDefault();

        if(nome !== '' && cnpj !== '' && enderoco !==''){
            await addDoc(collection(db,"customer"),{
                nomeFantasia: nome,
                cnpj:cnpj,
                endereco:enderoco
            })
            .then(()=>{
                setNome('');
                setCnpj('');
                setEnderoco('');

                toast.success("Cadastrado com sucesso!")
            })
            .catch((err)=>{
                toast.error('Ops! Deu algum erro!');
                console.log(err);
            })
        } else {
            toast.warn('Preencha todos os campos!');
        }
        
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Nome fantasia</label>
                        <input
                            type='text'
                            placeholder='Nome da empresa'
                            value={nome}
                            onChange={(e)=> setNome(e.target.value)}
                        />
                        <label>CNPJ</label>
                        <input
                            type='text'
                            placeholder='Digite o CNPJ'
                            value={cnpj}
                            onChange={(e)=> setCnpj(e.target.value)}
                        />
                        <label>Endereço</label>
                        <input
                            type='text'
                            placeholder='Endereço da empresa'
                            value={enderoco}
                            onChange={(e)=> setEnderoco(e.target.value)}
                        />

                        <button type='submit' >Salvar</button>
                    </form>
                </div>

            </div>
        </div>
    )
}
