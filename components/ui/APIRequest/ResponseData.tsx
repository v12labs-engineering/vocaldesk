'use client'

import React, { useState, useEffect } from "react";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export default function ResponseData({ formData, setFormData }: any) {
    const [variables, setVariables] = useState<{ name: string; data: string }[]>(formData?.response_data || []);

    useEffect(() => {
        setFormData(variables);
    }, [variables]);

    const addVariable = () => {
        setVariables([...variables, { name: '', data: '' }]);
    }

    const removeVariable = (index: number) => {
        const newVariables = [...variables];
        newVariables.splice(index, 1);
        setVariables(newVariables);
    }

    const handleVariableChange = (index: number, name: string, data: string) => {
        const newVariables = [...variables];
        newVariables[index] = { ...newVariables[index], [name]: data };
        setVariables(newVariables);
    }

    return (
        <div className="flex flex-col gap-4 max-w-3xl px-4 py-6">
            <div className="space-y-2">
                <div className="space-y-2">
                    {variables.map((variable, index) => (
                        <div className="flex items-center justify-between gap-2" key={index}>
                            <div className="space-y-2 w-full">
                                <Label htmlFor={`variable-${index}-name`}>Name</Label>
                                <Input id={`variable-${index}-name`} placeholder="Name" value={variable.name} onChange={(e) => handleVariableChange(index, 'name', e.target.value)} />
                            </div>
                            <div className="space-y-2 w-full">
                                <Label htmlFor={`variable-${index}-data`}>Data</Label>
                                <Input id={`variable-${index}-data`} placeholder="Data" value={variable.data} onChange={(e) => handleVariableChange(index, 'data', e.target.value)} />
                            </div>
                            <div className="space-y-2 w-[10%]">
                                <Label htmlFor='remove' className="invisible">Remove</Label>
                                <Button id="remove" variant="outline" onClick={() => removeVariable(index)}><Cross1Icon /></Button>
                            </div>
                        </div>
                    ))}
                    <Button variant='outline' onClick={addVariable}>
                        <PlusIcon className="mr-2" />Add Variable
                    </Button>
                </div>
            </div>
        </div>
    )
}

