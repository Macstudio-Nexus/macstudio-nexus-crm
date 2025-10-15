"use client";
import { useState, useEffect, useRef } from "react";
import withRoleProtection from "../../auth/withRoleProtection";
import { Check, Loader, X, Plus, Trash2 } from "lucide-react";
import QuoteTemplate from "./QuoteTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface QuoteProps {
  onClose: () => void;
}

interface Expense {
  description: string;
  quantity: number;
  price: number;
}

function NewQuote({ onClose }: QuoteProps) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [latestQuoteNumber, setLatestQuoteNumber] = useState<number>(0);
  const quoteRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    type: "",
    contactId: "",
    projectId: "",
  });

  const [expenses, setExpenses] = useState<Expense[]>([
    { description: "", quantity: 1, price: 0 },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const { getClients } = await import("@/actions/contacts");
        const { getProjects } = await import("@/actions/projects/projects");
        const { getQuotes } = await import("@/actions/quotes");

        const [contactsData, projectsData, quotesData] = await Promise.all([
          getClients(),
          getProjects(),
          getQuotes(),
        ]);

        setContacts(contactsData);
        setAllProjects(projectsData);

        // Get the latest quote number
        if (quotesData && quotesData.length > 0) {
          const maxQuoteId = Math.max(...quotesData.map((q: any) => q.quoteId || 0));
          setLatestQuoteNumber(maxQuoteId);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadData();
  }, []);

  // Filter projects when contact is selected
  useEffect(() => {
    if (formData.contactId) {
      const filtered = allProjects.filter(
        (project) => project.contactId === formData.contactId
      );
      setFilteredProjects(filtered);
      // Reset project selection if current selection doesn't match contact
      const currentProject = allProjects.find(p => p.id === formData.projectId);
      if (currentProject && currentProject.contactId !== formData.contactId) {
        setFormData(prev => ({ ...prev, projectId: "" }));
      }
    } else {
      setFilteredProjects([]);
      setFormData(prev => ({ ...prev, projectId: "" }));
    }
  }, [formData.contactId, allProjects]);

  const handleAddExpense = () => {
    setExpenses([...expenses, { description: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveExpense = (index: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, i) => i !== index));
    }
  };

  const handleExpenseChange = (
    index: number,
    field: keyof Expense,
    value: string | number
  ) => {
    const updatedExpenses = expenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense
    );
    setExpenses(updatedExpenses);
  };

  const generatePDF = async () => {
    if (!quoteRef.current) return;

    try {
      // Temporarily remove zoom for capture
      const originalZoom = quoteRef.current.style.zoom;
      quoteRef.current.style.zoom = '1';

      // Wait for re-render without zoom
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(quoteRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 912,
        height: 1056,
        onclone: (clonedDoc) => {
          // Fix any lab() color issues by converting modern colors to hex
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el: Element) => {
            const htmlEl = el as HTMLElement;
            const computedStyle = window.getComputedStyle(el);

            // Force background colors to standard values
            if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('lab')) {
              htmlEl.style.backgroundColor = '#ffffff';
            }

            // Force text colors - replace blue-400 with hex equivalent
            if (computedStyle.color && computedStyle.color.includes('lab')) {
              htmlEl.style.color = '#60a5fa';
            }

            // Force border colors
            if (computedStyle.borderColor && computedStyle.borderColor.includes('lab')) {
              htmlEl.style.borderColor = '#000000';
            }
          });
        }
      });

      // Restore zoom
      quoteRef.current.style.zoom = originalZoom;

      // Verify canvas was created successfully
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Failed to generate canvas from template');
      }

      const imgData = canvas.toDataURL("image/png");

      // Verify the image data is valid
      if (!imgData || imgData === 'data:,') {
        throw new Error('Failed to generate image data from canvas');
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [912, 1056],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 912, 1056);

      const selectedContact = contacts.find(c => c.id === formData.contactId);
      const fileName = `Quote_${latestQuoteNumber + 1}_${selectedContact?.companyName || 'Unknown'}.pdf`;

      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);
    setError(false);

    try {
      // Generate and download PDF first
      await generatePDF();

      const { createQuote } = await import("@/actions/quotes");

      // Create FormData object
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("type", formData.type);
      formDataToSubmit.append("contactId", formData.contactId);
      formDataToSubmit.append("projectId", formData.projectId);
      formDataToSubmit.append("expenses", JSON.stringify(expenses));

      const result = await createQuote(formDataToSubmit);

      // Clear form and show success
      setFormData({
        type: "",
        contactId: "",
        projectId: "",
      });
      setExpenses([{ description: "", quantity: 1, price: 0 }]);
      setIsFormLoading(false);
      setSuccess(true);
      window.dispatchEvent(new CustomEvent("quoteCreated"));

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error creating quote:", error);
      setError(true);
      setIsFormLoading(false);
    }
  };

  const calculateTotal = () => {
    return expenses.reduce(
      (sum, expense) => sum + expense.quantity * expense.price,
      0
    );
  };

  return (
    <div className="inset-0 fixed z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-[95vw] h-[90vh] flex gap-4">
        {/* Form Section */}
        <div className="h-full overflow-y-auto rounded-xl w-[500px] text-text-light bg-component-bg border-1 border-border py-2">
        {success ? (
          <div className="text-3xl font-space flex flex-col justify-center items-center p-2">
            <Check className="size-15 text-neon-green" />
            <span className="text-center">
              Quote successfully created
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center p-6 gap-2">
            <X className="size-15 text-red-500" />
            <h2 className="font-space text-2xl text-red-500 text-center">
              Error Creating Quote, please try again
            </h2>
            <button onClick={onClose} className="form-button mt-4">
              Exit
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-space text-2xl md:text-3xl lg:text-4xl text-center pt-4">
              Create New Quote
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-2 lg:space-y-4 p-6"
            >
              <div>
                <input
                  id="type"
                  type="text"
                  placeholder="Quote Type *"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="form-inputs"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contactId"
                  className="block text-sm lg:text-lg font-medium ml-1"
                >
                  Contact *
                </label>
                <select
                  id="contactId"
                  value={formData.contactId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactId: e.target.value,
                    }))
                  }
                  className="form-inputs !max-w-full"
                  required
                  disabled={isLoadingData}
                >
                  <option value="">
                    {isLoadingData
                      ? "Loading contacts..."
                      : "Select a contact..."}
                  </option>
                  {contacts?.map((contact: any) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} - {contact.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="projectId"
                  className="block text-sm lg:text-lg font-medium ml-1"
                >
                  Project *
                </label>
                <select
                  id="projectId"
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectId: e.target.value,
                    }))
                  }
                  className="form-inputs"
                  required
                  disabled={isLoadingData || !formData.contactId}
                >
                  <option value="">
                    {isLoadingData
                      ? "Loading projects..."
                      : !formData.contactId
                      ? "Select a contact first..."
                      : filteredProjects.length === 0
                      ? "No projects for this contact"
                      : "Select a project..."}
                  </option>
                  {filteredProjects?.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm lg:text-lg font-medium ml-1">
                    Expenses *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddExpense}
                    className="flex items-center gap-1 text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                  >
                    <Plus className="size-4" />
                    Add Expense
                  </button>
                </div>

                {expenses.map((expense, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-end"
                  >
                    <input
                      type="text"
                      placeholder="Description *"
                      value={expense.description}
                      onChange={(e) =>
                        handleExpenseChange(index, "description", e.target.value)
                      }
                      className="form-inputs"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty *"
                      min="1"
                      step="1"
                      value={expense.quantity}
                      onChange={(e) =>
                        handleExpenseChange(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="form-inputs"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price *"
                      min="0"
                      step="1"
                      value={expense.price}
                      onChange={(e) =>
                        handleExpenseChange(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="form-inputs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExpense(index)}
                      disabled={expenses.length === 1}
                      className={`p-2 rounded ${
                        expenses.length === 1
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-red-500 hover:bg-red-500/10"
                      }`}
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                ))}

                <div className="text-right text-lg font-medium mt-4">
                  Total: ${calculateTotal().toFixed(2)}
                </div>
              </div>

              <div className="flex justify-center items-center gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="form-button"
                  disabled={isFormLoading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="form-button"
                  disabled={isFormLoading}
                >
                  {isFormLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader className="animate-[spin_2s_linear_infinite] size-6" />
                    </div>
                  ) : (
                    "Create Quote"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
        </div>

        {/* Preview Section */}
        <div className="flex-1 h-full overflow-auto bg-gray-800 rounded-xl p-4">
          <h2 className="text-white text-2xl font-space mb-4 text-center">Quote Preview</h2>
          <div className="flex justify-center items-start overflow-auto">
            <div ref={quoteRef} style={{ zoom: 0.7 }}>
              {formData.contactId ? (
                <QuoteTemplate
                  type={formData.type}
                  customerInfo={(() => {
                    const contact = contacts.find(c => c.id === formData.contactId);
                    return contact ? [
                      contact.name,
                      contact.companyName,
                      contact.email,
                      contact.phoneNumber,
                    ] : [];
                  })()}
                  expenses={expenses}
                  quoteNumber={latestQuoteNumber + 1}
                  date={new Date()}
                  tax={0}
                />
              ) : (
                <div className="text-white text-center p-8">
                  Select a contact to see preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(NewQuote, { allowedRoles: [1] });
