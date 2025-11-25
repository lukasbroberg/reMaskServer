class UserModel{
    async insertUser(email, password, name, age, studie){
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    age: age,
                    studie: studie
                }
            }
        })

        if(error){
            throw new Error(error.message);
        }
    }

    async selectPublicUser(user_email){

    }
}

export default UserModel;