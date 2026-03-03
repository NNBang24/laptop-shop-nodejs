"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const web_1 = __importDefault(require("./routers/web"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// config view engine 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
//config req.body 
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// config static files ( image , css ,js )
app.use(express_1.default.static('public'));
// config routers
(0, web_1.default)(app);
// getConnection() ;
//
app.listen(PORT, () => {
    console.log(`lang nghe tai http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map