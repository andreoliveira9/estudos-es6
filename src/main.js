import api from './api';

class App {
    constructor(){
        this.repositories = [];

        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.listEl = document.getElementById('repo-list');

        this.registerHandlers();
    }

    registerHandlers(){
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    setLoading(loading = true){
        if(loading === true){
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Carregando...'));
            loadingEl.setAttribute('id','loading');

            this.formEl.appendChild(loadingEl);
        }else{
            document.getElementById('loading').remove();
        }

    }

    async addRepository(event){
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if(repoInput.length === 0){
            return;

        }
        this.setLoading();
        try{
            const response = await api.get(`/repos/${repoInput}`);
            const {name, descripition, html_url, owner:{ avatar_url }} = response.data;
            console.log(response);
            this.repositories.push({
                name,
                descripition,
                avatar_url,
                html_url,
            });

            this.inputEl.value = '';
            this.render();
        }catch(err){
            alert('O repositório não existe!');
        }
        this.setLoading(false);
        
    }

    render(){
        this.listEl.innerHTML = '';

        this.repositories.forEach(repo =>{
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let descripitionEl = document.createElement('p');
            descripitionEl.appendChild(document.createTextNode(repo.descripition));

            let linkEl = document.createElement('a');
            linkEl.setAttribute('target','_blank');
            linkEl.setAttribute('href', repo.html_url);
            linkEl.appendChild(document.createTextNode('Acessar'));

            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descripitionEl);
            listItemEl.appendChild(linkEl);
            
            this.listEl.appendChild(listItemEl);
        });
    }
}
new App();