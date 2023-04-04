import { useContext, useEffect, useState } from "react"

import { AuthContext } from "../../contexts/auth";

import Header from "../../components/Header";
import Title from '../../components/Title';

import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";

import { Link } from "react-router-dom";

import { db } from "../../services/firebaseConnection";
import { collection, getDocs, orderBy, limit, startAfter, query } from 'firebase/firestore'

import './dashboard.css'

const listRef = collection(db, "chamados")

export default function Dashboard(){

    const { logout } = useContext(AuthContext);

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpy, setIsEmpy] = useState(false)

    useEffect(()=>{
        async function loadChamados(){

            const q = query(listRef,orderBy('created', 'desc'), limit(5))

            const querySnapshot = await getDocs(q)

            await updateState(querySnapshot);

            setLoading(false);
        }

        loadChamados();

        return () => {  }

    },[])

    async function updateState(querySnapshot){
        const isCollectionEmpy = querySnapshot.size === 0;

        if(!isCollectionEmpy){
            let lista = []
            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente:doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    status: doc.data().status,
                    complemento: doc.data().complemento,
                })
            });

            setChamados(chamados => [...chamados, ...lista])
        } else {
            setIsEmpy(true);
        }
    }

    return(
        <div>
            <Header/>

            <div className="content">

                <Title name="Tickets">
                    <FiMessageSquare size={25}/>
                </Title>

                <>
                    
                    {chamados.length === 0 ? (
                        <div className="container dashboard">
                            <span>Nenhum chamado encontrado...</span>
                            <Link to="/new" className="new">
                                <FiPlus color="#fff" size={25}/>
                                Novo chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link to="/new" className="new">
                                <FiPlus color="#fff" size={25}/>
                                Novo chamado
                            </Link>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Assunto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td data-label="Cliente">Mercado esquina</td>
                                        <td data-label="Assunto">Suporte</td>
                                        <td data-label="Status">
                                            <span className="badge" style={{backgroundColor:'#999'}}>Em Aberto</span>
                                        </td>
                                        <td data-label="Cadastrado">12/05/2022</td>
                                        <td data-label="#">
                                            <button className="action" style={{backgroundColor:'#3583f7'}}>
                                                <FiSearch color="#fff" size={17} />
                                            </button>
                                            <button className="action" style={{backgroundColor:'#f6a935'}}>
                                                <FiEdit2 color="#fff" size={17} />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )}
                    
                    
                </>
            </div>

        </div>
    )
}
