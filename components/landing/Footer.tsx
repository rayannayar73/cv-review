import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <FileText className="h-6 w-6" />
            <span className="text-lg font-semibold">CV Review</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">
              Besoin d'un portfolio professionnel ?
            </p>
            <a 
              href="https://ravelojaona-rayan.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Découvrez mes services de création de portfolio →
            </a>
          </div>

          <div className="text-center md:text-right">
            <div className="space-y-2">
              <a href="mailto:ry.ravelojaona@gmail.com" className="block text-gray-400 hover:text-white text-sm">
                ry.ravelojaona@gmail.com
              </a>
              <a href="tel:+261343139059" className="block text-gray-400 hover:text-white text-sm">
                +261 34 31 390 59
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 CV Review. Tous droits réservés. Propulsé par l'IA.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;