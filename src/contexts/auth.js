import { useState, createContext, useEffect } from 'react';
// importando do firebase conection o auth e a conexão com banco
import { auth, db } from '../services/firebaseConnection';
// importando do auth o hook para criar user
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { doc, getDoc, setDoc } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';


export const AuthContext = createContext({});

function AuthProvider({ children }){

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);


    useEffect(()=>{

        async function loadUser(){
            const storgeUser = localStorage.getItem('@chamadaPro');

            if (storgeUser) {
                setUser(JSON.parse(storgeUser));
                setLoading(false);
            }

            setLoading(false);
        }

        loadUser()
    },[])

    async function signIn(email, password){
        setLoadingAuth(true);
        
        await signInWithEmailAndPassword(auth, email,password)
        .then(async (value)=>{
            let uid = value.user.uid;

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef)

            let data = {
                uid:uid,
                nome:docSnap.data().nome,
                email:value.user.email,
                avatarUrl:docSnap.data().avatarUrl
            }

            setUser(data);
            storgeUser(data);
            setLoadingAuth(false);
            toast.success('Bem-vindo(a) de volta!')
            navigate('/dashboard');
        })
        .catch((e)=>{
            console.log("erro ao logar"+ e);
            setLoadingAuth(false)
            toast.warn("Ops algo deu errado!");
        })

    }

    //cadastrando user
    async function SignUp(email, password, name) {
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value)=>{
            let uid = value.user.uid

            await setDoc(doc(db,"users",uid), {
                nome: name,
                avatarUrl: null
            })
            .then(()=>{
                let data = {
                    uid:uid,
                    nome:name,
                    email:value.user.email,
                    avatarUrl:null
                };

                setUser(data);
                setLoadingAuth(false);
                toast.success("Seja bem-vindo ao sistema!")
                navigate("/dashboard");
                storgeUser(data);

            })

        })
        .catch((err)=>{
            console.log("erro ao cadastrar"+ err);
            setLoadingAuth(false);
        })

    }

    function storgeUser(data){
        localStorage.setItem('@chamadaPro', JSON.stringify(data));
    }

    async function logout() {
        await signOut(auth)
        localStorage.removeItem('@chamadaPro');
        setUser(null);
    }

    return(
        <AuthContext.Provider 
            value={{ 
                signed: !!user, // false
                user,
                signIn,
                SignUp,
                logout,
                loadingAuth,
                loading,
                storgeUser,
                setUser
            }} 
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;