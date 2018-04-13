import { Controller, Param, Body, Get, Post, Put, Delete } from "routing-controllers";

@Controller()
export class WelcomeController {

    @Get("/welcome")
    getAll() {
        return "This action returns all users";
    }

    @Get("/welcome/:name")
    getOne( @Param("name") name: string) {
        return "This action returns welcome #" + name;
    }

    @Post("/welcome")
    post( @Body() user: any) {
        return "Saving welcome...";
    }

    @Put("/welcome/:id")
    put( @Param("id") id: number, @Body() user: any) {
        return "Updating a welcome...";
    }

    @Delete("/welcome/:id")
    remove( @Param("id") id: number) {
        return "Removing welcome...";
    }

}