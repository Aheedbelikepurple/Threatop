import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.indicator.deleteMany();
  await prisma.threatCampaign.deleteMany();
  await prisma.threatActor.deleteMany();
  await prisma.cve.deleteMany();
  await prisma.dataFeed.deleteMany();

  console.log('Seeding Threat Campaigns...');
  const campaign1 = await prisma.threatCampaign.create({
    data: {
      name: 'Operation Ghost Hammer',
      actor: 'APT29 (Cozy Bear)',
      description: 'Sophisticated espionage campaign targeting government agencies. Utilizes deeply embedded malware in IT monitoring tools.',
      severity: 'Critical',
      tags: ['Espionage', 'Supply Chain', 'Government'],
      mitreTips: ['T1071 (Application Layer Protocol)', 'T1195 (Supply Chain Compromise)'],
    }
  });

  const campaign2 = await prisma.threatCampaign.create({
    data: {
      name: 'LockBit 3.0 Resurgence',
      actor: 'LockBit',
      description: 'Renewed ransomware campaign targeting the healthcare sector using double extortion methods.',
      severity: 'High',
      tags: ['Ransomware', 'Healthcare', 'Double Extortion'],
      mitreTips: ['T1486 (Data Encrypted for Impact)', 'T1068 (Exploitation for Privilege Escalation)'],
    }
  });

  console.log('Seeding Indicators of Compromise (IOCs)...');
  await prisma.indicator.createMany({
    data: [
      {
        value: '192.168.1.104',
        type: 'IP',
        tlp: 'Red',
        severity: 'Critical',
        source: 'AlienVault',
        campaignId: campaign1.id
      },
      {
        value: 'malicious-domain.com',
        type: 'Domain',
        tlp: 'Amber',
        severity: 'High',
        source: 'OSINT',
        campaignId: campaign2.id
      },
      {
        value: 'e3b0c44298fc1c149afbf4c8996fb924',
        type: 'Hash',
        tlp: 'Green',
        severity: 'Medium',
        source: 'VirusTotal'
      },
      {
        value: 'http://suspicious.org/payload.exe',
        type: 'URL',
        tlp: 'Red',
        severity: 'High',
        source: 'MISP'
      }
    ]
  });

  console.log('Seeding Threat Actors...');
  await prisma.threatActor.createMany({
    data: [
      {
        name: 'APT41',
        origin: 'China',
        motivation: 'Espionage & Financial',
        aliases: ['Barium', 'Winnti', 'Wicked Panda'],
        targets: ['Healthcare', 'Telecommunications', 'Software', 'Video Games'],
        description: 'A prolific cyber threat group that carries out state-sponsored espionage activity in parallel with financially motivated operations.'
      },
      {
        name: 'APT29',
        origin: 'Russia',
        motivation: 'Espionage',
        aliases: ['Cozy Bear', 'Nobelium', 'Midnight Blizzard'],
        targets: ['Government', 'Think Tanks', 'Healthcare', 'Energy'],
        description: 'Highly sophisticated threat group linked to the SVR, specializing in stealthy, long-term intelligence gathering.'
      }
    ]
  });

  console.log('Seeding CVEs...');
  await prisma.cve.createMany({
    data: [
      {
        cveId: 'CVE-2023-44487',
        score: 7.5,
        status: 'Exploited in the wild',
        vendor: 'Multiple',
        patch: 'Available',
        description: 'HTTP/2 Rapid Reset vulnerability allowing DDoS attacks.'
      },
      {
        cveId: 'CVE-2023-4966',
        score: 9.4,
        status: 'Exploited in the wild',
        vendor: 'Citrix',
        patch: 'Available',
        description: 'NetScaler ADC and NetScaler Gateway Information Disclosure Vulnerability (Citrix Bleed).'
      }
    ]
  });

  console.log('Seeding Data Feeds...');
  await prisma.dataFeed.createMany({
    data: [
      { name: 'AbuseIPDB', status: 'Active', indicators: 14520 },
      { name: 'URLhaus', status: 'Active', indicators: 8934 },
      { name: 'VirusTotal', status: 'Active', indicators: 102430 },
      { name: 'AlienVault OTX', status: 'Active', indicators: 54100 },
      { name: 'CISA KEV', status: 'Inactive', indicators: 0 }
    ]
  });

  console.log('Database Seeding Complete! ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
