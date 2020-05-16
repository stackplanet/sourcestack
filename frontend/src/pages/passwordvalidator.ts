export class PasswordValidator {

    static passwordValid(password: string){
        return password.length >= 8 &&
            password.match(/[a-z]/) &&
            password.match(/[A-Z]/) &&
            password.match(/[0-9]/);
    }

    static passwordPolicy(){
        return 'Password must be at least 8 characters, with at least one uppercase character, one lowercase character and one number.';
    }

}