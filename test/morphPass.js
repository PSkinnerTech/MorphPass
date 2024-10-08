const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "MorphPass"
const SYMBOL = "MP"

const INSTANCE_NAME = "Morphin Time"
const INSTANCE_COST = ethers.parseUnits('1', 'ether')
const INSTANCE_MAX_TICKETS = 100
const INSTANCE_TIME = "21:00"
const INSTANCE_DATE = "Sept 8th, 2024"
const INSTANCE_LOCATION = "Singapore"

describe("MorphPass", () => {
    let creator, buyer, morphPass

    beforeEach(async () => {
        [creator, buyer] = await ethers.getSigners()

        const MorphPass = await ethers.getContractFactory("MorphPass")
        morphPass = await MorphPass.deploy(NAME, SYMBOL)

        const transaction = await morphPass.connect(creator).list(
            INSTANCE_NAME,
            INSTANCE_COST,
            INSTANCE_MAX_TICKETS,
            INSTANCE_TIME,
            INSTANCE_DATE,
            INSTANCE_LOCATION
        )
        
        await transaction.wait()
    })

    describe("Deployment", () => {
        it("Sets Name", async() => {
            expect(await morphPass.name()).to.equal(NAME)
        })

        it("Sets Symbol", async () => {
            expect(await morphPass.symbol()).to.equal(SYMBOL)
        })

        it("Sets Owner", async () => {
            expect(await morphPass.owner()).to.equal(creator.address)
        })
    })

    describe("Instances", () => {
        it("Updates Instances Count", async () => {
            const totalInstances = await morphPass.totalInstances()
            expect(totalInstances).to.equal(1)
        })

        it("Returns Instance Attributes", async () => {
            const instance = await morphPass.getInstance(1)
            expect(instance.id).to.equal(1)
            expect(instance.name).to.equal(INSTANCE_NAME)
            expect(instance.cost).to.equal(INSTANCE_COST)
            expect(instance.tickets).to.equal(INSTANCE_MAX_TICKETS)
            expect(instance.time).to.equal(INSTANCE_TIME)
            expect(instance.date).to.equal(INSTANCE_DATE)
            expect(instance.location).to.equal(INSTANCE_LOCATION)
        })
    })

    describe("Minting", () => {
        const ID = 1
        const SEAT = 50
        const AMOUNT = ethers.parseUnits('1', 'ether')

        beforeEach(async () => {
            const transaction = await morphPass.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
            await transaction.wait()
        })

        it("Updates Number of Tickets Available", async () => {
            const instance = await morphPass.getInstance(1)
            expect(instance.tickets).to.equal(INSTANCE_MAX_TICKETS - 1)
        })

        it("Updates Ticket Purchase Status", async () => {
            const status = await morphPass.hasTicket(ID, buyer.address)
            expect(status).to.equal(true)
        })

        it("Updates Unique Ticket Availability Status", async () => {
            const owner = await morphPass.seatTaken(ID, SEAT)
            expect(owner).to.equal(buyer.address)
        })

        it("Updates Total Unique Ticket Status", async () => {
            const seats = await morphPass.getSeatsTaken(ID)
            expect(seats.length).to.equal(1)
            expect(seats[0]).to.equal(SEAT)
        })

        it("Updates Contract Balance", async () => {
            const balance = await ethers.provider.getBalance(await morphPass.getAddress())
            expect(balance).to.equal(AMOUNT)
        })
    })

    describe("Withdrawing", () => {
        const ID = 1
        const SEAT = 50
        const AMOUNT = ethers.parseEther("1")  // Changed from utils.parseUnits to parseEther
        let balanceBefore
        
        beforeEach(async () => {
            balanceBefore = await ethers.provider.getBalance(creator.address)
    
            let transaction = await morphPass.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
            await transaction.wait()
    
            transaction = await morphPass.connect(creator).withdraw()
            await transaction.wait()
        })
    
        it('Updates the owner balance', async () => {
            const balanceAfter = await ethers.provider.getBalance(creator.address)
            expect(balanceAfter).to.be.greaterThan(balanceBefore)
        })
    
        it('Updates the contract balance', async () => {
            const contractAddress = await morphPass.getAddress()
            const balance = await ethers.provider.getBalance(contractAddress)
            expect(balance).to.equal(0)
        })
    })

})