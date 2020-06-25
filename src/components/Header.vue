<template>
    <div class="header">
        <div>
            <router-link to="/">Home</router-link>
        </div>
        <div class="right">
            <a href="">{{name}}</a>
            <a @click.prevent="logout" href="">Logout</a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: ''
        }
    },
    created() {
        this.fetchUsername();
    },
    methods: {
        fetchUsername() {
            let username = localStorage.getItem('username');
            this.name = username

            // console.log(username)
        },
        logout() {
            let token = localStorage.getItem('token');

            axios.get('http://localhost:8000/api/v1/auth/logout?token='+token)
                .then(res => {
                    // console.log(res)
                    console.log('logout success');
                    localStorage.removeItem('token');
                    this.$router.push('/login');
                })
        }
    }
}
</script>