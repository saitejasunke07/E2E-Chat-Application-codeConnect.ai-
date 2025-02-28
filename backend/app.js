import express from "express"
import morgan from "morgan";
import connect from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"
connect();

const _dirname = path.resolve();

const app = express();

app.use(cors({
    origin: "https://codeconnect-ai.onrender.com",  
    credentials: true, 
}));
 //change it in production
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(express.static(path.join(_dirname,"/frontend/dist")));

app.use("/users",userRoutes);
app.use("/projects",projectRoutes);
app.use("/ai",aiRoutes);

app.get("*",(_,res)=>{
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
})

app.get('/',(req,res)=>{
    res.send('Hello world!');
});

export default app;
