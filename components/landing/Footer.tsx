import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <FileText className="h-6 w-6" />
                <span className="text-lg font-semibold">CV Review</span>
            </div>
            <p className="text-gray-400 text-sm">
                © 2025 CV Review. Tous droits réservés. Propulsé par l'IA.
            </p>
            </div>
        </div>
    </footer>
  )
}

export default Footer;