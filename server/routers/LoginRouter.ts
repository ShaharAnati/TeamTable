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
            const { email, password } = req.body;

            // Validate user input
            if (!(email && password)) {
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
            });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY || "",
                {
                    expiresIn: "2h",
                }
            );
            // return new user
            res.status(201).json({ user, token });
        } catch (err) {
            console.log(err);
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
                        expiresIn: "2h",
                    }
                );

                res.status(200).json({ user, token });
            }
            res.status(400).send("Invalid Credentials");
        } catch (err) {
            console.log(err);
        }
    });
    return router;
}

export default buildRouter;

