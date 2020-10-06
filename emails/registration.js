const keys = require('../keys')

module.exports = function(email) {
    return {
            to: email,
            from: keys.EMAIL_FROM,
            subject: 'Аккаунт создан',
            html: `
                <h1>Добро пожаловатьв наше приложение</h1>
                <p>Вы успешно создали аккаунт c email: ${email}</p>
                <hr />
                <a href="${keys.BASE_URL}">El'mogo sleep</a>
            `
    }
}