import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { Router } from 'express';
import UserSchema from '../mongoose/UserSchema';


const buildRouter = (): Router => {
    const router: Router = Router();

    // Register
    router.post("/register", async (req, res) => {
        /*
            #swagger.tags = ['Authentication']
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'User register data.',
                required: true,
                schema: {
                    email: "user@mail.com",
                    password: "1234"
                }
            }
        */

        try {
            const { email, password, phoneNumber, fullName } = req.body;

            // Validate user input
            if (!(email && password && phoneNumber && fullName)) {
                return res.status(400).send("All input is required");
            }

            const oldUser = await UserSchema.findOne({ email });
            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database
            const user = await UserSchema.create({
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
                phoneNumber: phoneNumber,
                fullName: fullName
            });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY || "",
                {
                    expiresIn: "2m",
                }
            );

            const refreshToken = jwt.sign(
                { user_id: user._id, email },
                process.env.REFRESH_KEY || "",
                {
                    expiresIn: "24h",
                }
            );


            if (user.tokens == null) {
                user.tokens = [refreshToken]
            } else {
                user.tokens.push(refreshToken);
            }
            await user.save();

            // return new user
            res.status(200).json({ user, token, refreshToken });
        } catch (err) {
            console.log(err);
            return res.status(409).send("User Already Exist. Please Login");
        }
    });

    // Login
    router.post("/login", async (req, res) => {
        /* 
        #swagger.tags = ['Authentication']
        #swagger.parameters['body'] = {
                in: 'body',
                description: 'User login data.',
                required: true,
                schema: {
                    email: "user@mail.com",
                    password: "1234"
                }
            }
        */

        try {
            // Get user input
            const { email, password } = req.body;

            // Validate user input
            if (!(email && password)) {
                res.status(400).send("All input is required");
            }
            // Validate if user exist in our database
            const user = await UserSchema.findOne({ email });

            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.TOKEN_KEY || "",
                    {
                        expiresIn: "2m",
                    }
                );

                const refreshToken = jwt.sign(
                    { user_id: user._id, email },
                    process.env.TOKEN_KEY || "",
                    {
                        expiresIn: "24h",
                    }
                );

                if (user.tokens == null) {
                    user.tokens = [refreshToken]
                } else {
                    user.tokens.push(refreshToken);
                }
                await user.save()

                return res.status(200).json({ user, token, refreshToken });
            }
            return res.status(400).json("Invalid Credentials");
        } catch (err) {
            console.log(err);
            return res.status(400).json("Invalid Credentials");
        }
    });


    router.post("/refresh", async (req, res) => {
        let authHeaders = req.headers['authorization']
        const token = authHeaders && authHeaders.split(' ')[1];

        if (!token) {
            return res.status(401).json("Invalid token,try login again");
        }
        jwt.verify(token, process.env.REFRESH_KEY || ""),
            async (err: any, userInfo: any) => {
                if (err) {
                    // Wrong Refesh Token
                    return res.status(406).json({ message: 'Unauthorized' });
                }
                try {
                    const userId = userInfo._id;
                    let user = await UserSchema.findById(userId)
                    if (!user) {
                        return res.status(403).send('Invalid request');
                    }
                    if (!user.tokens.includes(token)) {
                        user.tokens = []
                        await user.save();
                        return res.status(403).send('Invalid request');
                    }
                    // Correct token we send a new access token
                    const accessToken = jwt.sign(
                        { user_id: user._id },
                        process.env.TOKEN_KEY || "",
                        {
                            expiresIn: "2m",
                        }
                    );

                    // Correct token we send a new access token
                    const refreshToken = jwt.sign(
                        { user_id: user._id },
                        process.env.TOKEN_KEY || ""
                    );

                    user.tokens[user.tokens.indexOf(token)] = refreshToken;
                    await user.save();
                    return res.status(200).send({ user, accessToken, refreshToken });
                } catch (e) {
                    res.status(403).send(err.message);
                }
            }
    });

    return router;

}


export default buildRouter;

