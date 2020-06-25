<template>
    <div>
        <div class="header">
            <div>
                <a href="#">Papan</a>
            </div>
        </div>
        <div class="form">
            <header>Login</header>
            <form action="">
                <input type="text" placeholder="Username" v-model="loginData.username">
                <input type="password" placeholder="Password" v-model="loginData.password">
                <input @click.prevent="login" type="submit" value="Login">
            </form>
        </div>
        <div class="form">
            <heade<div class="wrapper">
    <div class="container">
        <aside class="side">
            <div class="item action">
                <ul class="nav">
                    <li><a href="#">Login</a></li>
                </ul>
            </div>
            <div class="item form">
                <h1 role="heading" class="heading">Tuk Tuk Tour</h1>
                <div class="panel-content">
                    <form role="form">
                        <div class="form-group">
                            <input type="search" name="from" placeholder="From: " class="input">
                        </div>
                        <div class="form-group">
                            <input type="search" name="target" placeholder="Target: " class="input">
                        </div>
                        <div class="form-group form-content-right">
                            <button type="submit" class="btn btn-submit">Get Routes</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="item panel-list">
                <ul class="result-list">
                    <li>
                        <ul class="result-detail">
                            <li>
                                <label>From: </label>
                                <p>Lorem ipsum dolor sit amet sit.</p>
                            </li>
                            <li>
                                <label>To: </label>
                                <p>-</p>
                            </li>
                            <li>
                                <label>Time Schedule: </label>
                                <p>-</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <ul class="result-detail">
                            <li>
                                <label>From: </label>
                                <p>-</p>
                            </li>
                            <li>
                                <label>To: </label>
                                <p>-</p>
                            </li>
                            <li>
                                <label>Time Schedule: </label>
                                <p>-</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <ul class="result-detail">
                            <li>
                                <label>From: </label>
                                <p>-</p>
                            </li>
                            <li>
                                <label>To: </label>
                                <p>-</p>
                            </li>
                            <li>
                                <label>Time Schedule: </label>
                                <p>-</p>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </aside>
        <main class="map">
            <div class="map-container">
            </div>
        </main>
    </div>
</div>r>Register</header>
            <form action="">
                <input type="text" placeholder="First Name" v-model="registerData.first_name">
                <input type="text" placeholder="Last Name" v-model="registerData.last_name">
                <input type="text" placeholder="Username" v-model="registerData.username">
                <input type="password" placeholder="Password" v-model="registerData.password">
                <input type="password" placeholder="Confirm Password" v-model="confirmPass">
                <input @click.prevent="register" type="submit" value="Register">
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            domain: 'http://localhost:8000/api/',
            loginData: {
                'username': '',
                'password': ''
            },
            registerData: {
                'first_name': '',
                'last_name': '',
                'username': '',
                'password': ''
            },
            confirmPass: ''
        }
    },
    methods: {
        login() {
            axios.post(this.domain+'v1/auth/login', this.loginData)
                .then(res => {
                    let token = res.data.token;
                    localStorage.setItem('token', token);

                    if(res.data.message == 'success') {
                        localStorage.setItem('username', this.loginData.username)
                    }

                    this.$router.push('/');
                })
        },
        register() {
            if(this.confirmPass !== this.registerData.password) {
                alert('confirm password not match');
                return;
            }

            axios.post(this.domain+'v1/auth/register/', this.registerData)
                .then(res => {
                    let token = res.data.token;
                    localStorage.setItem('token', token);
                    alert('register success! Please login');
                })
        }
    }
}
</script>