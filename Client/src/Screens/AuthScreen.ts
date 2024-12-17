class AuthScreen {

    form : HTMLFormElement;
    usernameLabel : HTMLLabelElement;
    usernameInput : HTMLInputElement;
    passwordLabel : HTMLLabelElement;
    passwordInput : HTMLInputElement;
    submit : HTMLInputElement;

    constructor(form : HTMLFormElement, 
        usernameLabel : HTMLLabelElement,
        usernameInput : HTMLInputElement,
        passwordLabel : HTMLLabelElement,
        passwordInput : HTMLInputElement,
        submit : HTMLInputElement){
            this.form = form;
            this.usernameLabel = usernameLabel;
            this.usernameInput = usernameInput;
            this.passwordLabel = passwordLabel;
            this.passwordInput = passwordInput;
            this.submit = submit;
        }

    static makeScreen(doc:Document) : AuthScreen{
        doc.body.replaceChildren(); //Empty the document
        let form = doc.createElement("form");
        form.setAttribute("id", "AuthForm");
        
        let UsernameLabel = doc.createElement("label");
        UsernameLabel.setAttribute("for", "UsernameInput");
        UsernameLabel.textContent = "Username : ";
        
        let UsernameInput = doc.createElement("input")
        UsernameInput.setAttribute("id", "UsernameInput");
        UsernameInput.setAttribute("type", "text");
        
        
        let PasswordLabel = doc.createElement("label");
        PasswordLabel.setAttribute("for", "PasswordInput");
        PasswordLabel.textContent = "Password : ";

        let PasswordInput = doc.createElement("input")
        PasswordInput.setAttribute("id", "PasswordInput");
        PasswordInput.setAttribute("type", "password");

        let submit = doc.createElement("input")
        submit.setAttribute("id", "SubmitAuth");
        submit.setAttribute("type", "submit");

        form.appendChild(UsernameLabel);
        form.appendChild(doc.createElement("br"));
        form.appendChild(UsernameInput);
        form.appendChild(doc.createElement("br"));
        form.appendChild(PasswordLabel);
        form.appendChild(doc.createElement("br"));
        form.appendChild(PasswordInput);
        form.appendChild(doc.createElement("br"));
        form.appendChild(submit);

        doc.body.appendChild(form);

        return new AuthScreen(form, UsernameLabel, UsernameInput, PasswordLabel, PasswordInput, submit);
    }
}

export { AuthScreen }