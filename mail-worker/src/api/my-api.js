import app from '../hono/hono';
import signatureService from '../service/signature-service';
import userService from '../service/user-service';
import result from '../model/result';
import userContext from '../security/user-context';

app.get('/my/loginUserInfo', async (c) => {
	const user = await userService.loginUserInfo(c, userContext.getUserId(c));
	return c.json(result.ok(user));
});

app.put('/my/resetPassword', async (c) => {
	await userService.resetPassword(c, await c.req.json(), userContext.getUserId(c));
	return c.json(result.ok());
});

app.delete('/my/delete', async (c) => {
	await userService.delete(c, userContext.getUserId(c));
	return c.json(result.ok());
});



app.get('/my/signature', async (c) => {
    const data = await signatureService.get(c, userContext.getUserId(c), userContext.getUser(c).email);
    return c.json(result.ok(data));
});

app.put('/my/signature', async (c) => {
    const data = await signatureService.save(c, userContext.getUserId(c), await c.req.json());
    return c.json(result.ok(data));
});
