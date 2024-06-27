export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-6 py-3 bg-white border border-block rounded-xl font-semibold text-md text-gray-100 uppercase tracking-widest bg-gradient-to-r from-primary-light to-primary-dark hover:bg-gradient-to-br focus:bg-red-800 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
