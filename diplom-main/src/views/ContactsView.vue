<script>

</script>

<template>
    <div class="contacts">
        <div class="container">
            <div class="blocks">
                <div class="first-block">
                    <div class="text-info">
                        <h1>Остались вопросы? Звоните или пишите нам на почту!</h1>
                        <p>Тел: <a href="tel: 89159678522" >+7 (915) 967-85-22</a></p>
                        <p>Email: <a href="mailto:rinoharik@gmail.com">rinoharik@gmail.com</a></p><br>
                        <p>Агентство недвижимости "Пульс"</p>
                        <p>150014, г. Ярославль, улица Богдановича, 3</p>
                    </div>
                    <div class="icons-info">
                        <a href="https://vk.com/skynasty"><img src="../components/icons/vk.svg" alt="" height="50px"></a>
                        <a href="https://telegram.org/a/"><img src="../components/icons/tg.svg" alt="" height="50px"></a>
                    </div>
                </div>
                <div class="second-block">
                    <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ad9b9848faa1b0a89df97c47cac3dd57f1dbe1a6cda0bd31cb73a5f69bd76383e&amp;source=constructor" width="1000" height="700" frameborder="0"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>


.blocks {
    display: flex;
    margin-left: 85px;
    margin-right: 85px;
    height: 100%;
}

.first-block {
    
    width: 45%;
    margin-right: 40px;
}

h1 {
    margin-top: 180px;
    margin-bottom: 60px;
    font-size: 45px;
    font-weight: bold;
}

p {
    font-size: 25px;
}

img {
    margin-top: 40px;
    margin-right: 10px;
}
.second-block {
    display: flex;
    width: 55%;
}

iframe {
    box-shadow: 0 0 25px #7a7a7a8a;
    margin-top: 85px;
}

a {
    color: black;
}
</style>