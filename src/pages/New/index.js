
import { useState, useEffect, useContext } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle} from 'react-icons/fi';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection,getDocs, getDoc, doc, addDoc } from 'firebase/firestore'

import './new.css';
import { toast } from 'react-toastify'

const listRef = collection(db,"customer");

export default function New(){

  const { user } = useContext(AuthContext);
  const { id } = useParams(); 

  const [customers, setCustomers] = useState([]);
  const [loadCustomer, setLoadCustomer] = useState(true);
  const [customerSelected, setCustomerSelected]  = useState(0);

  const [complemento, setComplemento] = useState('')
  const [assunto, setAssunto] = useState('Suporte')
  const [status, setStatus] = useState('Aberto');
  const [idCustomer, setIdCustomers] = useState(false)


  useEffect(()=>{
    
    async function loadCustomer(){

      const querySnapshot = await getDocs(listRef)
      .then((snapshot)=>{  
        
        let lista = [];

        snapshot.forEach((doc)=>{
          lista.push({
            id:doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })
        
        if (snapshot.docs.size === 0) {
            console.log("NENHUMA EMPRESA ENCONTRADA!");
            setCustomers([{id:"1", nomeFantasia:"Freela"}])
            setLoadCustomer(false);
            return;
        }

        setCustomers(lista);
        setLoadCustomer(false);

        if(id){
          loadId(lista);
        }

      })
      .catch((e)=>{
        console.log("erro ao buscar" + e);
        setLoadCustomer(false);
        setCustomers([{id:"1", nomeFantasia:"Freela"}])
      })

    }

    loadCustomer();

  },[id])

  async function loadId(lista){
    const docRef = doc(db, "chamados", id);
    await getDoc(docRef)
    .then((snapshot)=>{
      
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento);


      let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
      setCustomerSelected(index);

      setIdCustomers(true);

    })
    .catch((e)=>{
      console.log(e);
      setIdCustomers(false);
    })
  }

  function handleOptionChange(e){
    setStatus(e.target.value);
    
  }

  function handleChangeSelect(e){
    setAssunto(e.target.value);
    
  }

  function hendleCustomerChange(e){
    setCustomerSelected(e.target.value);
    console.log(customers[e.target.value].nomeFantasia);
  }

  async function handleRegister(e){
    e.preventDefault();

    if(idCustomer){
      
      

      return;
    }

    //registrar

    await addDoc(collection(db,"chamados"), {
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId:customers[customerSelected].id,
      assunto: assunto,
      complemento	: complemento,
      status: status,
      userId: user.uid,
    })
    .then(()=>{
      toast.success("Chamado registrado");
      setComplemento('')
      setCustomerSelected(0);
    })
    .catch((e)=>{
      toast.error("Ops! Erro ao registrar, tente mais tarde!");
      console.log(e);
    })
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25}/>
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>

            <label>Clientes</label>
            {
              loadCustomer? (
                <input type='text' disabled={true} value="Carregando.."/>
              ) : (
                <select value={customerSelected} onChange={hendleCustomerChange}>
                  {customers.map((item, index)=>{
                    return(
                        <option key={index} value={index}>
                          {item.nomeFantasia}
                        </option>
                    )
                  })} 
                </select>
              )
            }

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={ status === 'Aberto' }
              />
              <span>Em aberto</span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={ status === 'Progresso' }
              />
              <span>Progresso</span>

              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={ status === 'Atendido' }
              />
              <span>Atendido</span>
            </div>


            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opcional)."
              value={complemento}
              onChange={ (e) => setComplemento(e.target.value) }
            />

            <button type="submit">Registrar</button>

          </form>
        </div>
      </div>
    </div>
  )
}