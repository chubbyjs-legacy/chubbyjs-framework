abstract class RouterError implements Error {
    public name: string;
    public message: string;
    public code: number;
    public stack?: string;

    protected constructor(name: string, message: string, code: number) {
        this.name = name;
        this.message = message;
        this.code = code;
    }
}

export default RouterError;
