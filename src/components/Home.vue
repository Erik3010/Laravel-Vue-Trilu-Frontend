<template>
    <div>
        <app-header></app-header>
        <div class="container">
            <div class="board-container">
                <div class="board-wrapper" v-for="boar in boards" :key="boar.id">
                    <div class="board"  @click.self="openBoard(boar.id)" >
                        <span @click.self="updateClick($event.target)">{{boar.name}}</span>
                        <input type="text" placeholder="Are you sure want to delete?" autofocus style="display:none" v-model="board.name" @keyup.enter='updateBoard($event.target, boar.id)'>
                    </div>
                </div>

                <div class="board-wrapper" @click="isCreate = 1">
                    <div class="board new-board">
                        <span v-show="!isCreate">Create new board...</span>
                        <input v-show="isCreate" @keyup.enter="createBoard" type="text" placeholder="New Board Name" autofocus v-model="board.name">
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
    components: {
        'app-header': Header
    },
    data() {
        return {
            domain: 'http://localhost:8000/api/',
            token: localStorage.getItem('token'),
            isCreate: 0,
            boards: [],
            board: {'name':''}
        }
    },
    created() {
        this.fetchBoard()
    },
    methods: {
        fetchBoard() {
            axios.get(this.domain+'v1/board?token='+this.token)
                .then(res => {
                    this.boards = res.data;

                }).catch(err => {
                    console.log(err)
                })
        },
        createBoard() {
            axios.post(this.domain+'v1/board?token='+this.token, this.board)
                .then(res => {
                    this.isCreate = 0
                    this.board.name = '';
                    this.fetchBoard();
                    console.log('created');
                })
                .catch(err => {
                    alert('you are not the creator or member of this board')
                })
        },
        updateClick(e) {
            e.style.display = 'none';
            e.parentNode.lastChild.style.display = '';

            this.board.name = e.innerHTML;
        },
        updateBoard(e, id) {
            e.style.display = 'none';
            e.parentNode.firstChild.style.display = ''

            if(this.board.name == '') {
                axios.delete(this.domain+'v1/board/'+id+'?token='+this.token)
                    .then(res => {
                        this.fetchBoard();
                    })
                    .catch(err => {
                        alert('you are not the creator of this board')
                    })
                return;
            }

            axios.put(this.domain+'v1/board/'+id+'?token='+this.token, this.board)
                .then(res => {
                    this.fetchBoard();
                })
                .catch(err => {
                    alert('you are not the member of this board')
                })
        }
    }
}
</script>