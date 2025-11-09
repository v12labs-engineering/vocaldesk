export interface DomainConfig {
	logo: string;
	primaryColor: string;
	companyName: string;
}

const domainConfigs: Record<string, DomainConfig> = {
	localhost: {
		companyName: "VocalDesk",
		logo: "/vocaldesk.svg",
		primaryColor: "221.2deg, 83.2%, 53.3%",
	},
	default: {
		companyName: "VocalDesk",
		logo: "/vocaldesk.svg",
		primaryColor: "221.2deg, 83.2%, 53.3%",
	},
	"app.vocaldesk.co": {
		companyName: "VocalDesk",
		logo: "/vocaldesk.svg",
		primaryColor: "151.8deg 47.1% 40.8%",
	},
	"knottyrhapsody.store": {
		companyName: "Knotty Rhapsody",
		logo: "/logo/knottylogo.png",
		primaryColor: "30 35% 64%",
	},
	"ai.maxmembers.net": {
		companyName: "MaxMembers",
		logo: "/logo/wvfitness.jpeg",
		primaryColor: "151.8deg 47.1% 40.8%",
	},
	"evolveai.maxmembers.net": {
		companyName: "Evolve",
		logo: "/logo/evolve.png",
		primaryColor: "151.8deg 47.1% 40.8%",
	},
	"echelonai.maxmembers.net": {
		companyName: "Echelon",
		logo: "/logo/echelon.jpeg",
		primaryColor: "151.8deg 47.1% 40.8%",
	},
	"4seasonsai.maxmembers.net": {
		companyName: "4Seasons",
		logo: "/logo/4seasons.jpeg",
		primaryColor: "151.8deg 47.1% 40.8%",
	},
	"bluemoonai.maxmembers.net": {
		companyName: "Bluemoon",
		logo: "/logo/bluemoon.jpeg",
		primaryColor: "151.8deg 47.1% 40.8%",
	},
	"theedgeai.maxmembers.net": {
		companyName: "The Edge",
		logo: "/logo/theedge.png",
		primaryColor: "151.8deg 47.1% 40.8%",
	},
	"njacai.maxmembers.net": {
		companyName: "Cross Gates",
		logo: "/logo/crossgates.jpeg",
		primaryColor: "151.8deg 47.1% 40.8%",
	},
	"app.ubigrowth.com": {
		companyName: "Ubi Growth",
		logo: "/logo/ubigrowth.png",
		primaryColor: "242.55deg, 80.49%, 59.80%",
	},
};

export default domainConfigs;
