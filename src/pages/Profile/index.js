import { useContext, useState } from 'react'

import Header from '../../components/Header'
import Title from '../../components/Title';

import { FiSettings, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';

import {db, store} from '../../services/firebaseConnection'
import {doc, updateDoc} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'


import { toast } from 'react-toastify';

import './profile.css';

export default function Profile(){

    const { user, storgeUser, setUser, logout } = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image))
            }else {
                toast.warn("Envie uma imagem do tipo PNG ou JPEG");
                setImageAvatar(null);
                return;
            }
        }
    }

    async function handleUpload(){
        const currendtUid = user.uid;

        const uploadRef = ref(store, `images/${currendtUid}/${imageAvatar.name}`)

        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot)=>{
            
            getDownloadURL(snapshot.ref).then(async (downLoadURL)=>{
                let urlFoto = downLoadURL;

                const docRef = doc(db, "users", user.uid)
                await updateDoc(docRef, {
                    avatarUrl:urlFoto,
                    nome: nome,
                })
                .then(()=>{
                    let data = {
                        ...user,
                        nome:nome,
                        avatarUrl:urlFoto,
                    }
    
                    setUser(data);
                    storgeUser(data);
                    toast.success("Atualizado com sucesso!")
                })
            })

        })
    }

    async function handleSubmit(e){
        e.preventDefault();

        if(imageAvatar === null && nome !== ''){
            // atualizar apenas o nome do user
            const docRef = doc(db,"users", user.uid);
            await updateDoc(docRef,{
                nome:nome,
            })
            .then(()=>{
                let data = {
                    ...user,
                    nome:nome,
                }

                setUser(data);
                storgeUser(data);
                toast.success("Atualizado com sucesso!")
            })
            .catch((err)=>{
                toast.warn("Ops! Deu algum erro")
                console.log(err);
            })
        } else if(nome !== '' && imageAvatar !== null){

            // atualizar nome e foto

            handleUpload()

        }

    }

    

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name="Minha conta">
                    <FiSettings size={25} />
                </Title>

                <div className='container'>

                    <form className='form-profile' onSubmit={handleSubmit}>

                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#fff' size={25} />
                            </span>

                            <input type='file' accept="image/*" onChange={handleFile}/><br/>
                            { avatarUrl === null ?(
                                <img src={avatar} alt="foto de perfil" width={250} height={250}/>
                            ) : (
                                <img src={avatarUrl} alt="foto de perfil" width={250} height={250} />
                            )}
                        </label>
                        
                        <label>Nome</label>
                        <input  type='text' placeholder='Seu nome' value={nome} onChange={(e)=> setNome(e.target.value)}/>

                        <label>Email</label>
                        <input  type='email' value={email} disabled={true}/>
                        

                        <button type='submit' >Salvar</button>
                    </form> 

                </div>

                <div className='container'>
                    <button className='logount-btn' onClick={()=> logout()} >Sair</button>
                </div>

            </div>
        </div>
    )
}

