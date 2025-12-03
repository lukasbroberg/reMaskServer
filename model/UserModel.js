import supabase from "../supabase.js";

class UserModel{
    async authUserSignUp({email, password}){
        const { data, error } = await supabase
        .auth
        .signUp({
            email: email,
            password: password,
        })

        if(error){
            throw new Error(error.message);
        }

        console.log(data)
        return data;
    }

    async insertNewUserOnUserTable({firstName, lastName, studie, UUID}){
        const {data, error} = await supabase
        .from('users')
        .upsert({
            firstName: firstName,
            lastName: lastName,
            studie: studie,
            uuid: UUID,
        })
        .select();

        if(error){
            throw new Error(error.message);
        }

        return data;
    }

    async authUserLogin(email, password){

        if(!email || !password){
            throw new Error('Email and password are required');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if(error){
            throw new Error(error.message);
        }

        return data;
    }

    async getUserFromAuthUUID(UUID){
        const {data, error} = await supabase
        .from('users')
        .select()
        .eq('uuid',UUID);

        if(error){
            console.log(error.message)
            throw new Error(error.message);
        }

        return data;
    }

    //GetUser (refreshes session)
    async getCurrentUser(accessToken){
        const {data, error} = await supabase
        .auth
        .getUser(accessToken)

        if(error){
            throw new Error(error.message);
        }

        return data;
    }

}

export default UserModel;