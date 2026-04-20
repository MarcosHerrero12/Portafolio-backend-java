import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('pending'); // success, failure, pending

    useEffect(() => {
        // Mercado Pago devuelve el estado en la URL (collection_status o status)
        const mpStatus = searchParams.get('status');
        if (mpStatus === 'approved') setStatus('success');
        else if (mpStatus === 'rejected') setStatus('failure');
        else setStatus('pending');
    }, [searchParams]);

    const content = {
        success: {
            icon: <CheckCircle className="w-20 h-20 text-green-500" />,
            title: "¡Pago Exitoso!",
            message: "Tu pago ha sido procesado correctamente. ¡Gracias por tu compra!",
            buttonClass: "bg-green-600 hover:bg-green-700"
        },
        failure: {
            icon: <XCircle className="w-20 h-20 text-red-500" />,
            title: "Pago Rechazado",
            message: "Hubo un problema al procesar tu pago. Por favor, intenta de nuevo.",
            buttonClass: "bg-red-600 hover:bg-red-700"
        },
        pending: {
            icon: <Clock className="w-20 h-20 text-amber-500" />,
            title: "Pago Pendiente",
            message: "Tu pago está siendo procesado. Te avisaremos cuando se complete.",
            buttonClass: "bg-amber-600 hover:bg-amber-700"
        }
    };

    const current = content[status];

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                    {current.icon}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{current.title}</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    {current.message}
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/')}
                        className={`w-full py-4 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${current.buttonClass}`}
                    >
                        Volver al Inicio
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    {status === 'failure' && (
                        <button
                            onClick={() => navigate('/cart')}
                            className="w-full py-4 text-gray-600 bg-gray-100 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                        >
                            Reintentar desde el carrito
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
