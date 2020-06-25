<template>
    <div>
        <app-header></app-header>
        <div class="team-container">
            <div class="board-name">{{data.name}}</div>
            <div
                class="member"
                title="John Doe"
                v-for="mbr in data.members"
                :key="mbr.id"
                @click="clickMember(mbr.first_name, mbr.last_name, mbr.id)"
            >
                {{ mbr.initial.toUpperCase() }}
            </div>

            <!-- show this buttons when a member clicked -->
            <a href="" v-show="isDelete" class="button" @click.prevent="deleteUser">Delete {{ removeUsername }}</a>
            <!-- back to normal state when cancel pressed -->
            <a href="" v-show="isDelete" @click.prevent="isDelete=0" class="button">Cancel</a>

            <a href="" v-show="!isDelete" class="button" @click.prevent="isCreateMember=1">
                <span v-show="!isCreateMember">+ Add member</span>
                <input
                    v-show="isCreateMember"
                    type="text"
                    placeholder="Username"
                    autofocus
                    @keyup.enter = "addMember"
                    v-model="member.username"
                >
            </a>
        </div>
        <div class="card-container">
            <div class="content">
                <div class="list" v-for="lists in data.lists" :key="lists.id">
                    <header @click.self="updateControl($event.target, lists.name, lists.id)">
                        <span>{{ lists.name }}</span>
                        <span v-show="isMove">(click here to move card)</span>
                        <input
                            type="text"
                            value="Backlog"
                            placeholder="Are you sure want to delete?"
                            autofocus
                            style="display: none"
                            @keyup.enter = 'updateList($event.target, lists.id)'
                            v-model="list.name"
                        >
                    </header>
                    <div class="cards">
                        <div class="card" v-for="cards in lists.cards" :key="cards.card_id">
                            <div class="card-content" @click.self="isUpdateCard($event.target, cards.card_id, cards.task)">
                                <span>{{ cards.task }}</span>
                                <input
                                    type="text"
                                    placeholder="Are you sure want to delete?"
                                    autofocus
                                    style="display: none"
                                    v-model="card.task"
                                    @keyup.enter = "updateCard($event.target, lists.id ,cards.card_id)"
                                >
                            </div>
                            <div class="control">
                                <span @click="cardControl(cards.card_id, 'up')">&uarr;</span>
                                <span @click="cardControl(cards.card_id, 'down')">&darr;</span>
                            </div>
                        </div>
                    </div>
                    <div class="button" @click.self="isCreateCard($event.target)">
                        <span>+ Add new card</span>
                        <input
                            type="text"
                            placeholder="New card"
                            autofocus
                            @keyup.enter = "createCard($event.target, lists.id)"
                            style="display: none"
                            v-model="card.task"
                        >
                    </div>
                    <div class="control">
                        <span @click="moveLeft(lists.id)">&larr;</span>
                        <span @click="moveRight(lists.id)">&rarr;</span>
                    </div>
                </div>
                <div class="list button" @click.self="isCreateList=1">
                    <span @click.self="isCreateList=1" v-show="!isCreateList">+ Add another list</span>
                    <input
                        v-show="isCreateList"
                        type="text"
                        placeholder="New List Name"
                        autofocus
                        @keyup.enter = 'createList'
                        v-model="list.name"
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
    components: {
        'app-header': Header
    },
    data() {
        return {
            data: [],
            domain: 'http://localhost:8000/api/',
            token: localStorage.getItem('token'),
            boardId: this.$route.params.id,
            isCreateMember: 0,
            isDelete: 0,
            removeUsername: '',
            member: {'username': ''},
            isCreateList: 0,
            list: {'name': ''},
            isListEdit: 0,
            card: {'task':''},
            isMove: 0
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            axios.get(this.domain+'v1/board/'+this.boardId+'?token='+this.token)
                .then(res => {
                    this.data = res.data;
                    console.log(this.data);
                })
                .catch(err => {
                    this.$router.push('/');
                    alert('you are not this board member');
                })
        },
        addMember() {
            this.isCreateMember = 0;

            axios.post(this.domain+'v1/board/'+this.boardId+'/member?token='+this.token, this.member)
                .then(res => {
                    // console.log(res)
                    this.member.username = ''
                    this.fetchData();
                })
        },
        clickMember(first, last, id) {
            this.isDelete = 1;
            this.removeUsername = first +" "+ last;

            localStorage.setItem('usernameId', id);
        },
        deleteUser() {
            let id = localStorage.getItem('usernameId');

            axios.delete(this.domain+'v1/board/'+this.boardId+'/member/'+id+'?token='+this.token)
                .then(res => {
                    this.fetchData();
                    this.isDelete = 0;
                })
        },
        createList() {
            this.isCreateList = 0;

            axios.post(`${this.domain}v1/board/${this.boardId}/list/?token=${this.token}`, this.list)
                .then(res => {
                    // console.log(res)
                    this.fetchData()
                    this.list.name = ''
                })
        },
        updateControl(e, name, listId) {
            let cardId = localStorage.getItem('cardId');

            if(this.isMove) {
                axios.post(`${this.domain}v1/card/${cardId}/move/${listId}?token=${this.token}`)
                    .then(res => {
                        console.log(res)
                        this.fetchData();
                        localStorage.removeItem('cardId');
                        this.isMove = 0;
                    })
                return;
            }

            e.firstChild.style.display = 'none';
            e.lastChild.style.display = ''

            this.list.name = name;
        },
        updateList(e, id) {
            e.parentNode.firstChild.style.display = '';
            e.parentNode.lastChild.style.display = 'none';

            if(this.list.name == "") {
                axios.delete(`${this.domain}v1/board/${this.boardId}/list/${id}/?token=${this.token}`)
                    .then(res => {
                        this.fetchData()
                    })
                return;
            }

            axios.put(`${this.domain}v1/board/${this.boardId}/list/${id}?token=${this.token}`, this.list)
                .then(res => {
                    // console.log(res);
                    this.fetchData();
                })
        },
        moveLeft(id) {
            axios.post(`${this.domain}v1/board/${this.boardId}/list/${id}/left?token=${this.token}`)
                .then(res => {
                    // console.log(res)
                    this.fetchData()
                })
                .catch(err => {
                    alert('move offset')
                })
        },
        moveRight(id) {
            axios.post(`${this.domain}v1/board/${this.boardId}/list/${id}/right?token=${this.token}`)
                .then(res => {
                    // console.log(res)
                    this.fetchData()
                })
                .catch(err => {
                    alert('move offset')
                })
        },
        isCreateCard(e) {
            e.firstChild.style.display = 'none';
            e.lastChild.style.display = '';
        },
        createCard(e, listId) {
            e.parentNode.firstChild.style.display = '';
            e.parentNode.lastChild.style.display = 'none';

            axios.post(`${this.domain}v1/board/${this.boardId}/list/${listId}/card?token=${this.token}`, this.card)
                .then(res => {
                    console.log(res);
                    this.fetchData()
                    this.card.task = ''
                })
        },
        isUpdateCard(e, cardId, task) {
            e.firstChild.style.display = 'none';
            e.lastChild.style.display  = '';

            localStorage.setItem('cardId', cardId);

            this.card.task = task;
            this.isMove = 1;

            // this.applyCSS()
        },
        updateCard(e, listId, cardId) {
            e.parentNode.firstChild.style.display = '';
            e.parentNode.lastChild.style.display = 'none';

            if(this.card.task == "") {
                axios.delete(`${this.domain}v1/board/${this.boardId}/list/${listId}/card/${cardId}?token=${this.token}`)
                    .then(res => {
                        console.log(res);
                        this.fetchData();
                    })
                return;
            }

            axios.put(`${this.domain}v1/board/${this.boardId}/list/${listId}/card/${cardId}?token=${this.token}`, this.card)
                .then(res => {
                    console.log(res);
                    this.fetchData()
                })
        },
        cardControl(cardId, condition) {
            axios.post(`${this.domain}v1/card/${cardId}/${condition}?token=${this.token}`)
                .then(res => {
                    console.log(res);
                    this.fetchData()
                })
        },
        applyCSS(el) {
            let cssRule = `.list header::after {
                                content: '(click here to move card)';
                                font-size: 0.8em;
                            }`;

            let style = document.createElement('style');
            style.type = 'text/css';

            this.$el.appendChild(style);
            style.innerHTML = cssRule;
        }
    }
}
</script>