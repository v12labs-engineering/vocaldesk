"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/Toasts/use-toast";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import LoadingDots from "../LoadingDots";

export default function LiveTransfer({
	numberDetails,
}: { numberDetails: any }) {
	const { toast } = useToast();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [transferList, setTransferList] = useState(
		numberDetails.transfer_list || {},
	);

	useEffect(() => {
		setTransferList(numberDetails.transfer_list || {});
	}, [numberDetails.transfer_list]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const department = String(e.currentTarget.department.value).trim();
		const phonenumber = String(e.currentTarget.phonenumber.value).trim();

		if (department === "" || phonenumber === "") {
			setIsSubmitting(false);
			return;
		}

		const updatedTransferList = { ...transferList, [department]: phonenumber };

		const payload = {
			phone_number: numberDetails.phone_number,
			transfer_list: updatedTransferList,
		};

		try {
			await axios.post("/api/agent", payload);
			setTransferList(updatedTransferList);
			setIsDialogOpen(false);
			toast({
				title: "Success!",
				description: "Phone number added to transfer list.",
				variant: "default",
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Oops! Something went wrong.",
				description:
					"Failed to add phone number to transfer list. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (key: string) => {
		setIsDeleting(true);
		const updatedTransferList = { ...transferList };
		delete updatedTransferList[key];

		const payload = {
			phone_number: numberDetails.phone_number,
			transfer_list: updatedTransferList,
		};

		try {
			await axios.post("/api/agent", payload);
			setTransferList(updatedTransferList);
			toast({
				title: "Success!",
				description: "Phone number removed from transfer list.",
				variant: "default",
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Oops! Something went wrong.",
				description:
					"Failed to remove phone number from transfer list. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Live Transfer List</CardTitle>
				<CardDescription>Give your agent the ability to transfer calls to a set of phone numbers.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mt-8 mb-4">
					<div className="space-y-4">
						<div className="space-y-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<p className="text-sm font-semibold">Department</p>
								<p className="text-sm font-semibold">Phone Number</p>
							</div>
							{Object.keys(transferList).length > 0 ? (
								Object.entries(transferList).map(([key, val]) => (
									<div key={key} className="grid grid-cols-4 items-center gap-4">
										<p className="text-sm">{key}</p>
										<p className="text-sm">{val as React.ReactNode}</p>
										<Button
											variant="ghost"
											onClick={() => handleDelete(key)}
											className="rounded px-2 h-8 w-8 text-destructive hover:bg-destructive/80"
											disabled={isDeleting}
										>
											<Trash2Icon className="h-4 w-4 text-center" />
										</Button>
									</div>
								))
							) : (
								<p className="text-sm">
									No phone numbers added to transfer list.
								</p>
							)}
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex flex-col items-start justify-between sm:flex-row sm:items-center w-full">
					{!numberDetails?.phone_number && (
						<p className="pb-4 sm:pb-0">
							Purchase a phone number before you update the list.
						</p>
					)}
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button disabled={!numberDetails?.phone_number}>
								Add Phone Number
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Phone Number</DialogTitle>
								<DialogDescription>
									Make changes to your transfer list here. Click save when
									you're done.
								</DialogDescription>
							</DialogHeader>
							<form
								className="grid gap-4 py-4"
								id="liveTransferForm"
								onSubmit={handleSubmit}
							>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="department" className="text-right">
										Department
									</Label>
									<Input
										id="department"
										placeholder="Sales, Billing etc.,"
										className="col-span-3"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="phonenumber" className="text-right">
										Phone Number
									</Label>
									<Input
										id="phonenumber"
										placeholder="Phone number"
										className="col-span-3"
									/>
								</div>
							</form>
							<DialogFooter>
								<Button
									disabled={!numberDetails?.phone_number || isSubmitting}
									form="liveTransferForm"
									type="submit"
								>
									Save{" "}
									{isSubmitting && (
										<span className="ml-2">
											<LoadingDots />
										</span>
									)}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</CardFooter>
		</Card>
	);
}
